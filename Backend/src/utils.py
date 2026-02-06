"""
Utility functions for the plant disease detection system
"""

import os
import json
import numpy as np
from PIL import Image
import cv2


def load_class_indices(class_indices_path='models/class_indices_reverse.json'):
    """
    Load class indices mapping (index -> class name)
    
    Args:
        class_indices_path: Path to JSON file containing class indices
        
    Returns:
        Dictionary mapping indices to class names
    """
    with open(class_indices_path, 'r') as f:
        class_indices = json.load(f)
    # Convert string keys to integers
    return {int(k): v for k, v in class_indices.items()}


def preprocess_image(image_path, target_size=(224, 224)):
    """
    Load and preprocess image for model inference
    
    Args:
        image_path: Path to image file or PIL Image object
        target_size: Target size for resizing (height, width)
        
    Returns:
        Preprocessed image array ready for model input
    """
    # Load image
    if isinstance(image_path, str):
        img = Image.open(image_path).convert('RGB')
    else:
        img = image_path.convert('RGB')
    
    # Resize
    img = img.resize(target_size)
    
    # Convert to array and normalize
    img_array = np.array(img) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


def format_disease_name(raw_name):
    """
    Format raw class name to human-readable disease name
    
    Args:
        raw_name: Raw class name from folder (e.g., 'Tomato_Late_blight')
        
    Returns:
        Formatted disease name (e.g., 'Tomato - Late Blight')
    """
    # Replace underscores with spaces
    formatted = raw_name.replace('_', ' ')
    
    # Split into plant and disease
    parts = formatted.split(' ', 1)
    if len(parts) == 2:
        plant, disease = parts
        # Capitalize properly
        disease = disease.title()
        return f"{plant} - {disease}"
    
    return formatted.title()


def get_disease_info(disease_name):
    """
    Get structured information about a disease for LLM context
    
    Args:
        disease_name: Name of the disease
        
    Returns:
        Dictionary with disease information
    """
    # Parse disease components
    if ' - ' in disease_name:
        plant, condition = disease_name.split(' - ', 1)
    else:
        plant = disease_name
        condition = "Unknown"
    
    return {
        'plant': plant,
        'condition': condition,
        'is_healthy': 'healthy' in condition.lower()
    }


def calculate_confidence_metrics(predictions, top_k=3):
    """
    Calculate confidence metrics from model predictions
    
    Args:
        predictions: Softmax output from model
        top_k: Number of top predictions to return
        
    Returns:
        Dictionary containing confidence metrics
    """
    # Get top k predictions
    top_indices = np.argsort(predictions[0])[-top_k:][::-1]
    top_confidences = predictions[0][top_indices]
    
    # Calculate metrics
    max_confidence = float(top_confidences[0])
    confidence_gap = float(top_confidences[0] - top_confidences[1]) if len(top_confidences) > 1 else 1.0
    entropy = float(-np.sum(predictions[0] * np.log(predictions[0] + 1e-10)))
    
    return {
        'max_confidence': max_confidence,
        'confidence_gap': confidence_gap,
        'entropy': entropy,
        'top_k_indices': top_indices.tolist(),
        'top_k_confidences': top_confidences.tolist()
    }


def is_prediction_reliable(confidence_metrics, threshold=0.7, min_gap=0.2):
    """
    Determine if CNN prediction is reliable based on multiple criteria
    
    Args:
        confidence_metrics: Output from calculate_confidence_metrics
        threshold: Minimum confidence threshold
        min_gap: Minimum gap between top 2 predictions
        
    Returns:
        Boolean indicating if prediction is reliable
    """
    return (confidence_metrics['max_confidence'] >= threshold and 
            confidence_metrics['confidence_gap'] >= min_gap)


def enhance_image_for_analysis(image_path):
    """
    Enhance image quality for better visual analysis
    Useful for BLIP model input
    
    Args:
        image_path: Path to image file
        
    Returns:
        Enhanced PIL Image
    """
    # Read image
    img = cv2.imread(image_path)
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    l = clahe.apply(l)
    enhanced = cv2.merge([l, a, b])
    enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
    
    # Convert to PIL
    enhanced_pil = Image.fromarray(cv2.cvtColor(enhanced, cv2.COLOR_BGR2RGB))
    
    return enhanced_pil


def create_visualization(image_path, prediction_result, save_path=None):
    """
    Create visualization of prediction result
    
    Args:
        image_path: Path to input image
        prediction_result: Dictionary with prediction information
        save_path: Optional path to save visualization
        
    Returns:
        PIL Image with visualization
    """
    import matplotlib.pyplot as plt
    from matplotlib.patches import Rectangle
    
    # Load image
    img = Image.open(image_path)
    
    # Create figure
    fig, ax = plt.subplots(1, 1, figsize=(10, 8))
    ax.imshow(img)
    ax.axis('off')
    
    # Add prediction info as text box
    info_text = f"Prediction: {prediction_result['disease']}\n"
    info_text += f"Confidence: {prediction_result['confidence']:.2%}\n"
    info_text += f"Source: {prediction_result['source']}"
    
    # Create text box
    props = dict(boxstyle='round', facecolor='white', alpha=0.8)
    ax.text(0.02, 0.98, info_text, transform=ax.transAxes, 
            fontsize=12, verticalalignment='top', bbox=props)
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches='tight')
        
    return fig


def validate_image(image_path, max_size_mb=10):
    """
    Validate image file before processing
    
    Args:
        image_path: Path to image file
        max_size_mb: Maximum allowed file size in MB
        
    Returns:
        Tuple (is_valid, error_message)
    """
    # Check if file exists
    if not os.path.exists(image_path):
        return False, "File does not exist"
    
    # Check file size
    file_size_mb = os.path.getsize(image_path) / (1024 * 1024)
    if file_size_mb > max_size_mb:
        return False, f"File too large ({file_size_mb:.2f} MB > {max_size_mb} MB)"
    
    # Check if it's a valid image
    try:
        img = Image.open(image_path)
        img.verify()  # Verify it's an image
        return True, "Valid image"
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"


def get_model_summary_stats(model):
    """
    Get summary statistics about the model
    
    Args:
        model: Keras model
        
    Returns:
        Dictionary with model statistics
    """
    total_params = model.count_params()
    trainable_params = sum([np.prod(w.shape) for w in model.trainable_weights])
    non_trainable_params = total_params - trainable_params
    
    return {
        'total_parameters': total_params,
        'trainable_parameters': trainable_params,
        'non_trainable_parameters': non_trainable_params,
        'model_size_mb': total_params * 4 / (1024 * 1024),  # Approximate size in MB
        'num_layers': len(model.layers)
    }