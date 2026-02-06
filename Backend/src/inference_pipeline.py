"""
Complete Inference Pipeline for Plant Disease Detection
Integrates CNN, BLIP, and TinyLLaMA for comprehensive analysis
"""

import os
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from datetime import datetime

# Import custom modules
from utils import (
    load_class_indices,
    preprocess_image,
    format_disease_name,
    calculate_confidence_metrics,
    is_prediction_reliable,
    validate_image,
    enhance_image_for_analysis
)
from blip_fallback import BLIPImageAnalyzer, create_llm_prompt_from_blip
from llm_advisor import AgricultureAdvisor


class PlantDiseaseInferencePipeline:
    """
    Complete end-to-end inference pipeline for plant disease detection
    """
    
    def __init__(
        self,
        cnn_model_path='models/best_model.h5',
        class_indices_path='models/class_indices_reverse.json',
        confidence_threshold=0.7,
        confidence_gap_threshold=0.2,
        use_blip=True,
        use_llm=True
    ):
        """
        Initialize the inference pipeline
        
        Args:
            cnn_model_path: Path to trained CNN model
            class_indices_path: Path to class indices JSON
            confidence_threshold: Minimum confidence for CNN prediction
            confidence_gap_threshold: Minimum gap between top-2 predictions
            use_blip: Whether to use BLIP for fallback
            use_llm: Whether to use LLM for advice
        """
        print("=" * 70)
        print("INITIALIZING PLANT DISEASE INFERENCE PIPELINE")
        print("=" * 70)
        
        self.confidence_threshold = confidence_threshold
        self.confidence_gap_threshold = confidence_gap_threshold
        self.use_blip = use_blip
        self.use_llm = use_llm
        
        # Load CNN model
        print("\n📦 Loading CNN model...")
        self.cnn_model = self._load_cnn_model(cnn_model_path)
        
        # Load class indices
        print("📋 Loading class indices...")
        self.class_indices = load_class_indices(class_indices_path)
        print(f"✅ Loaded {len(self.class_indices)} classes")
        
        # Initialize BLIP if needed
        self.blip_analyzer = None
        if self.use_blip:
            print("\n🖼️ Initializing BLIP analyzer...")
            try:
                self.blip_analyzer = BLIPImageAnalyzer()
            except Exception as e:
                print(f"⚠️ BLIP initialization failed: {e}")
                print("   Continuing without BLIP fallback")
                self.use_blip = False
        
        # Initialize LLM advisor if needed
        self.advisor = None
        if self.use_llm:
            print("\n🤖 Initializing LLM advisor...")
            try:
                self.advisor = AgricultureAdvisor()
            except Exception as e:
                print(f"⚠️ LLM advisor initialization failed: {e}")
                print("   Continuing without LLM advisory")
                self.use_llm = False
        
        print("\n✅ Pipeline initialization complete!")
        print("=" * 70)
    
    def _load_cnn_model(self, model_path):
        """
        Load trained CNN model
        """
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found: {model_path}")
        
        model = tf.keras.models.load_model(model_path)
        print(f"✅ CNN model loaded from {model_path}")
        return model
    
    def predict(self, image_path, verbose=True):
        """
        Run complete prediction pipeline
        
        Args:
            image_path: Path to input image
            verbose: Whether to print detailed information
            
        Returns:
            Dictionary with complete prediction results
        """
        if verbose:
            print("\n" + "=" * 70)
            print("RUNNING PREDICTION PIPELINE")
            print("=" * 70)
            print(f"📸 Image: {image_path}")
        
        # Validate image
        is_valid, message = validate_image(image_path)
        if not is_valid:
            return {
                'success': False,
                'error': message
            }
        
        # Step 1: CNN Prediction
        if verbose:
            print("\n[1/3] Running CNN prediction...")
        
        cnn_result = self._run_cnn_prediction(image_path)
        
        # Step 2: Confidence-based routing
        if verbose:
            print(f"\n[2/3] Analyzing confidence...")
            print(f"      CNN Confidence: {cnn_result['confidence']:.2%}")
            print(f"      Threshold: {self.confidence_threshold:.2%}")
        
        # Determine if we should use CNN or BLIP
        use_cnn = is_prediction_reliable(
            cnn_result['confidence_metrics'],
            self.confidence_threshold,
            self.confidence_gap_threshold
        )
        
        if use_cnn:
            if verbose:
                print(f"      ✅ Using CNN prediction (reliable)")
            
            final_diagnosis = cnn_result['disease_name']
            final_confidence = cnn_result['confidence']
            source = "CNN Classification"
            visual_description = None
            
        else:
            if verbose:
                print(f"      ⚠️ CNN confidence below threshold")
            
            if self.use_blip and self.blip_analyzer is not None:
                if verbose:
                    print(f"      🔄 Routing to BLIP for visual analysis...")
                
                blip_result = self._run_blip_analysis(image_path)
                final_diagnosis = "Uncertain - Visual Analysis"
                final_confidence = cnn_result['confidence']
                source = "BLIP Visual Analysis"
                visual_description = blip_result['combined_description']
            else:
                if verbose:
                    print(f"      ⚠️ BLIP not available, using low-confidence CNN result")
                
                final_diagnosis = cnn_result['disease_name'] + " (Low Confidence)"
                final_confidence = cnn_result['confidence']
                source = "CNN Classification (Low Confidence)"
                visual_description = None
        
        # Step 3: Get LLM advice
        if verbose:
            print(f"\n[3/3] Generating agricultural advice...")
        
        if self.use_llm and self.advisor is not None:
            if source.startswith("BLIP"):
                advice = self.advisor.get_advice_for_blip_analysis(
                    visual_description,
                    blip_result
                )
            else:
                # Extract plant type
                plant_type = final_diagnosis.split(' - ')[0] if ' - ' in final_diagnosis else "plant"
                advice = self.advisor.get_advice_for_cnn_prediction(
                    final_diagnosis,
                    final_confidence,
                    plant_type
                )
        else:
            advice = self._create_basic_advice(final_diagnosis, final_confidence)
        
        # Compile final result
        result = {
            'success': True,
            'diagnosis': final_diagnosis,
            'confidence': final_confidence,
            'source': source,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'cnn_predictions': cnn_result,
            'visual_description': visual_description,
            'advice': advice,
            'image_path': image_path
        }
        
        if verbose:
            print("\n✅ Prediction complete!")
        
        return result
    
    def _run_cnn_prediction(self, image_path):
        """
        Run CNN prediction on image
        """
        # Preprocess image
        img_array = preprocess_image(image_path, target_size=(224, 224))
        
        # Get predictions
        predictions = self.cnn_model.predict(img_array, verbose=0)
        
        # Get top prediction
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])
        disease_name = self.class_indices[predicted_idx]
        formatted_name = format_disease_name(disease_name)
        
        # Calculate confidence metrics
        confidence_metrics = calculate_confidence_metrics(predictions, top_k=3)
        
        # Get top 3 predictions
        top_3_predictions = []
        for idx, conf in zip(confidence_metrics['top_k_indices'], 
                            confidence_metrics['top_k_confidences']):
            top_3_predictions.append({
                'disease': format_disease_name(self.class_indices[idx]),
                'confidence': float(conf)
            })
        
        return {
            'disease_name': formatted_name,
            'confidence': confidence,
            'confidence_metrics': confidence_metrics,
            'top_3_predictions': top_3_predictions,
            'raw_predictions': predictions[0].tolist()
        }
    
    def _run_blip_analysis(self, image_path):
        """
        Run BLIP visual analysis
        """
        # Enhance image for better analysis
        enhanced_image = enhance_image_for_analysis(image_path)
        
        # Analyze with BLIP
        blip_result = self.blip_analyzer.analyze_image(enhanced_image)
        
        return blip_result
    
    def _create_basic_advice(self, diagnosis, confidence):
        """
        Create basic advice when LLM is not available
        """
        is_healthy = 'healthy' in diagnosis.lower()
        
        if is_healthy:
            advice_text = f"""Your plant appears to be HEALTHY (Confidence: {confidence:.1%}).

General Recommendations:
• Continue current care practices
• Monitor regularly for any changes
• Maintain proper watering and fertilization
• Ensure adequate sunlight and air circulation

Preventive Measures:
• Practice crop rotation
• Remove diseased plant debris
• Avoid overhead watering
• Monitor for pests regularly"""
        else:
            advice_text = f"""Disease Detected: {diagnosis} (Confidence: {confidence:.1%})

Immediate Actions:
• Isolate affected plants if possible
• Remove severely infected leaves
• Improve air circulation around plants
• Avoid overhead watering

Treatment Options:
• Consult with local agricultural extension office
• Consider appropriate fungicides or treatments
• Follow product labels carefully

Preventive Measures:
• Practice crop rotation
• Use disease-resistant varieties
• Maintain proper plant spacing
• Monitor plants regularly

Note: For specific treatment recommendations, please consult with a local agricultural expert."""
        
        return {
            'diagnosis': diagnosis,
            'confidence': confidence,
            'source': 'Basic Advisory',
            'full_advice': advice_text,
            'summary': f"Detected: {diagnosis} with {confidence:.1%} confidence",
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def print_result(self, result):
        """
        Print formatted result
        """
        if not result['success']:
            print(f"\n❌ Error: {result['error']}")
            return
        
        print("\n" + "=" * 70)
        print("DIAGNOSIS REPORT")
        print("=" * 70)
        print(f"🔍 Diagnosis: {result['diagnosis']}")
        print(f"📊 Confidence: {result['confidence']:.2%}")
        print(f"🔬 Source: {result['source']}")
        print(f"🕒 Timestamp: {result['timestamp']}")
        
        print("\n" + "=" * 70)
        print("TOP 3 CNN PREDICTIONS")
        print("=" * 70)
        for i, pred in enumerate(result['cnn_predictions']['top_3_predictions'], 1):
            print(f"{i}. {pred['disease']}: {pred['confidence']:.2%}")
        
        if result['visual_description']:
            print("\n" + "=" * 70)
            print("VISUAL ANALYSIS (BLIP)")
            print("=" * 70)
            print(result['visual_description'])
        
        print("\n" + "=" * 70)
        print("AGRICULTURAL ADVICE")
        print("=" * 70)
        print(result['advice']['full_advice'])
        print("=" * 70)
    
    def save_result(self, result, output_path='results/prediction_result.json'):
        """
        Save result to JSON file
        """
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Convert numpy types to native Python types for JSON serialization
        serializable_result = json.loads(
            json.dumps(result, default=lambda o: float(o) if isinstance(o, np.floating) else o)
        )
        
        with open(output_path, 'w') as f:
            json.dump(serializable_result, f, indent=4)
        
        print(f"\n💾 Result saved to {output_path}")


def main():
    """
    Main inference pipeline demo
    """
    import sys
    
    print("=" * 70)
    print("PLANT DISEASE DETECTION - INFERENCE PIPELINE")
    print("=" * 70)
    
    # Get image path from command line or use default
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
    else:
        # Default test image path
        image_path = "test_images/sample_leaf.jpg"
        print(f"\nNo image path provided. Using default: {image_path}")
        print("Usage: python inference_pipeline.py <path_to_image>")
    
    # Check if image exists
    if not os.path.exists(image_path):
        print(f"\n❌ Error: Image not found at {image_path}")
        return
    
    # Initialize pipeline
    try:
        pipeline = PlantDiseaseInferencePipeline(
            cnn_model_path='models/best_model.h5',
            class_indices_path='models/class_indices_reverse.json',
            confidence_threshold=0.7,
            confidence_gap_threshold=0.2,
            use_blip=True,
            use_llm=True
        )
    except Exception as e:
        print(f"\n❌ Error initializing pipeline: {e}")
        return
    
    # Run prediction
    try:
        result = pipeline.predict(image_path, verbose=True)
        
        # Display result
        pipeline.print_result(result)
        
        # Save result
        output_path = f"results/prediction_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        pipeline.save_result(result, output_path)
        
    except Exception as e:
        print(f"\n❌ Error during prediction: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()