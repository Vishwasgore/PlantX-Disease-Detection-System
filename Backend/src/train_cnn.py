"""
CNN Training Module for Plant Disease Detection
Uses MobileNetV2 with Transfer Learning for CPU-efficient training
"""

import os
import json
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

class PlantDiseaseClassifier:
    """
    A CNN-based classifier for plant disease detection using transfer learning
    """
    
    def __init__(self, dataset_path, img_size=224, batch_size=32, validation_split=0.2):
        """
        Initialize the classifier
        
        Args:
            dataset_path: Path to dataset directory containing class folders
            img_size: Input image size (default: 224 for MobileNetV2)
            batch_size: Batch size for training
            validation_split: Fraction of data to use for validation
        """
        self.dataset_path = dataset_path
        self.img_size = img_size
        self.batch_size = batch_size
        self.validation_split = validation_split
        self.model = None
        self.history = None
        self.class_indices = None
        
    def prepare_data_generators(self):
        """
        Create data generators with augmentation for training and validation
        """
        print("🔧 Preparing data generators...")
        
        # Training data augmentation - helps prevent overfitting
        train_datagen = ImageDataGenerator(
            rescale=1./255,                    # Normalize pixel values to [0,1]
            rotation_range=40,                 # Random rotation up to 40 degrees
            width_shift_range=0.2,             # Random horizontal shift
            height_shift_range=0.2,            # Random vertical shift
            shear_range=0.2,                   # Shear transformation
            zoom_range=0.2,                    # Random zoom
            horizontal_flip=True,              # Random horizontal flip
            fill_mode='nearest',               # Fill missing pixels
            validation_split=self.validation_split
        )
        
        # Validation data - only rescaling, no augmentation
        validation_datagen = ImageDataGenerator(
            rescale=1./255,
            validation_split=self.validation_split
        )
        
        # Create training generator
        self.train_generator = train_datagen.flow_from_directory(
            self.dataset_path,
            target_size=(self.img_size, self.img_size),
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='training',
            shuffle=True,
            seed=42
        )
        
        # Create validation generator
        self.validation_generator = validation_datagen.flow_from_directory(
            self.dataset_path,
            target_size=(self.img_size, self.img_size),
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='validation',
            shuffle=False,
            seed=42
        )
        
        # Store class indices for later use
        self.class_indices = self.train_generator.class_indices
        self.num_classes = len(self.class_indices)
        
        print(f"✅ Found {self.train_generator.samples} training images")
        print(f"✅ Found {self.validation_generator.samples} validation images")
        print(f"✅ Number of classes: {self.num_classes}")
        print(f"📋 Classes: {list(self.class_indices.keys())}")
        
        return self.train_generator, self.validation_generator
    
    def build_model(self, learning_rate=0.0001):
        """
        Build CNN model using MobileNetV2 transfer learning
        
        Args:
            learning_rate: Initial learning rate for optimizer
        """
        print("\n🏗️ Building model architecture...")
        
        # Load pre-trained MobileNetV2 (trained on ImageNet)
        # We exclude the top classification layer to add our own
        base_model = MobileNetV2(
            input_shape=(self.img_size, self.img_size, 3),
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze base model layers initially
        # This preserves learned features from ImageNet
        base_model.trainable = False
        
        # Build custom classification head
        x = base_model.output
        x = GlobalAveragePooling2D()(x)              # Reduce spatial dimensions
        x = Dense(512, activation='relu')(x)         # Dense layer for learning
        x = Dropout(0.5)(x)                          # Dropout to prevent overfitting
        predictions = Dense(self.num_classes, activation='softmax')(x)  # Output layer
        
        # Create final model
        self.model = Model(inputs=base_model.input, outputs=predictions)
        
        # Compile model
        self.model.compile(
            optimizer=Adam(learning_rate=learning_rate),
            loss='categorical_crossentropy',
            metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy')]
        )
        
        print("✅ Model built successfully")
        print(f"📊 Total parameters: {self.model.count_params():,}")
        print(f"📊 Trainable parameters: {sum([tf.size(w).numpy() for w in self.model.trainable_weights]):,}")
        
        return self.model
    
    def train(self, epochs=50, fine_tune_epochs=30):
        """
        Train the model in two phases:
        1. Train only the classification head
        2. Fine-tune the entire model with lower learning rate
        
        Args:
            epochs: Number of epochs for initial training
            fine_tune_epochs: Number of epochs for fine-tuning
        """
        print("\n🚀 Starting training process...\n")
        
        # Define callbacks
        callbacks = [
            # Save best model based on validation accuracy
            ModelCheckpoint(
                'models/best_model.h5',
                monitor='val_accuracy',
                save_best_only=True,
                mode='max',
                verbose=1
            ),
            # Stop if validation loss doesn't improve
            EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True,
                verbose=1
            ),
            # Reduce learning rate when validation loss plateaus
            ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7,
                verbose=1
            )
        ]
        
        # Phase 1: Train classification head only
        print("=" * 70)
        print("PHASE 1: Training classification head (base model frozen)")
        print("=" * 70)
        
        history1 = self.model.fit(
            self.train_generator,
            epochs=epochs,
            validation_data=self.validation_generator,
            callbacks=callbacks,
            verbose=1
        )
        
        # Phase 2: Fine-tune entire model
        print("\n" + "=" * 70)
        print("PHASE 2: Fine-tuning entire model")
        print("=" * 70)
        
        # Unfreeze base model for fine-tuning
        base_model = self.model.layers[0]
        base_model.trainable = True
        
        # Recompile with lower learning rate
        self.model.compile(
            optimizer=Adam(learning_rate=1e-5),  # Much lower learning rate
            loss='categorical_crossentropy',
            metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=3, name='top_3_accuracy')]
        )
        
        print(f"📊 Trainable parameters after unfreezing: {sum([tf.size(w).numpy() for w in self.model.trainable_weights]):,}")
        
        history2 = self.model.fit(
            self.train_generator,
            epochs=fine_tune_epochs,
            validation_data=self.validation_generator,
            callbacks=callbacks,
            verbose=1
        )
        
        # Combine histories
        self.history = {
            'accuracy': history1.history['accuracy'] + history2.history['accuracy'],
            'val_accuracy': history1.history['val_accuracy'] + history2.history['val_accuracy'],
            'loss': history1.history['loss'] + history2.history['loss'],
            'val_loss': history1.history['val_loss'] + history2.history['val_loss']
        }
        
        print("\n✅ Training completed!")
        
    def evaluate(self):
        """
        Evaluate model on validation set
        """
        print("\n📊 Evaluating model...")
        
        results = self.model.evaluate(self.validation_generator, verbose=1)
        
        print("\n" + "=" * 70)
        print("FINAL EVALUATION RESULTS")
        print("=" * 70)
        print(f"Validation Loss: {results[0]:.4f}")
        print(f"Validation Accuracy: {results[1]:.4f} ({results[1]*100:.2f}%)")
        print(f"Top-3 Accuracy: {results[2]:.4f} ({results[2]*100:.2f}%)")
        print("=" * 70)
        
        return results
    
    def plot_training_history(self, save_path='models/training_history.png'):
        """
        Plot training and validation accuracy/loss curves
        """
        if self.history is None:
            print("⚠️ No training history available")
            return
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
        
        # Plot accuracy
        ax1.plot(self.history['accuracy'], label='Training Accuracy', linewidth=2)
        ax1.plot(self.history['val_accuracy'], label='Validation Accuracy', linewidth=2)
        ax1.set_title('Model Accuracy over Epochs', fontsize=14, fontweight='bold')
        ax1.set_xlabel('Epoch', fontsize=12)
        ax1.set_ylabel('Accuracy', fontsize=12)
        ax1.legend(fontsize=10)
        ax1.grid(True, alpha=0.3)
        
        # Plot loss
        ax2.plot(self.history['loss'], label='Training Loss', linewidth=2)
        ax2.plot(self.history['val_loss'], label='Validation Loss', linewidth=2)
        ax2.set_title('Model Loss over Epochs', fontsize=14, fontweight='bold')
        ax2.set_xlabel('Epoch', fontsize=12)
        ax2.set_ylabel('Loss', fontsize=12)
        ax2.legend(fontsize=10)
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✅ Training history plot saved to {save_path}")
        plt.show()
    
    def save_model(self, model_path='models/cnn_model.h5', 
                   class_indices_path='models/class_indices.json'):
        """
        Save trained model and class indices
        """
        # Create models directory if it doesn't exist
        os.makedirs('models', exist_ok=True)
        
        # Save model
        self.model.save(model_path)
        print(f"✅ Model saved to {model_path}")
        
        # Save class indices (mapping from class name to index)
        with open(class_indices_path, 'w') as f:
            json.dump(self.class_indices, f, indent=4)
        print(f"✅ Class indices saved to {class_indices_path}")
        
        # Also save reverse mapping (index to class name) for inference
        reverse_indices = {v: k for k, v in self.class_indices.items()}
        reverse_path = class_indices_path.replace('.json', '_reverse.json')
        with open(reverse_path, 'w') as f:
            json.dump(reverse_indices, f, indent=4)
        print(f"✅ Reverse class indices saved to {reverse_path}")


def main():
    """
    Main training pipeline
    """
    print("=" * 70)
    print("PLANT DISEASE DETECTION - CNN TRAINING PIPELINE")
    print("=" * 70)
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Configuration
    DATASET_PATH = 'dataset'  # Update this to your dataset path
    IMG_SIZE = 224
    BATCH_SIZE = 32
    VALIDATION_SPLIT = 0.2
    INITIAL_EPOCHS = 50
    FINE_TUNE_EPOCHS = 30
    
    # Check if dataset exists
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")
    
    # Initialize classifier
    classifier = PlantDiseaseClassifier(
        dataset_path=DATASET_PATH,
        img_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        validation_split=VALIDATION_SPLIT
    )
    
    # Prepare data
    classifier.prepare_data_generators()
    
    # Build model
    classifier.build_model(learning_rate=0.0001)
    
    # Train model
    classifier.train(epochs=INITIAL_EPOCHS, fine_tune_epochs=FINE_TUNE_EPOCHS)
    
    # Evaluate model
    classifier.evaluate()
    
    # Plot training history
    classifier.plot_training_history()
    
    # Save model
    classifier.save_model()
    
    print(f"\n✅ Training pipeline completed successfully!")
    print(f"End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    main()