"""
BLIP Image Captioning Module for Fallback Scenario
Used when CNN confidence is below threshold
"""

import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import warnings
warnings.filterwarnings('ignore')


class BLIPImageAnalyzer:
    """
    BLIP-based image analyzer for plant disease visual description
    """
    
    def __init__(self, model_name="Salesforce/blip-image-captioning-base", device=None):
        """
        Initialize BLIP model for CPU inference
        
        Args:
            model_name: HuggingFace model identifier
            device: Device to run model on (defaults to CPU)
        """
        print("🔧 Initializing BLIP Image Analyzer...")
        
        # Force CPU usage
        if device is None:
            self.device = "cpu"
        else:
            self.device = device
            
        print(f"📌 Using device: {self.device}")
        
        # Load processor and model
        try:
            self.processor = BlipProcessor.from_pretrained(model_name)
            self.model = BlipForConditionalGeneration.from_pretrained(model_name)
            self.model.to(self.device)
            self.model.eval()  # Set to evaluation mode
            
            print("✅ BLIP model loaded successfully")
            
        except Exception as e:
            print(f"❌ Error loading BLIP model: {e}")
            raise
    
    def analyze_image(self, image_path, max_length=100, num_beams=4):
        """
        Generate detailed description of plant disease symptoms
        
        Args:
            image_path: Path to image file or PIL Image object
            max_length: Maximum length of generated caption
            num_beams: Number of beams for beam search
            
        Returns:
            Dictionary with visual analysis results
        """
        try:
            # Load image
            if isinstance(image_path, str):
                image = Image.open(image_path).convert('RGB')
            else:
                image = image_path.convert('RGB')
            
            # Generate unconditional caption (general description)
            caption = self._generate_caption(image, max_length, num_beams)
            
            # Generate conditional captions (focused descriptions)
            disease_focused = self._generate_conditional_caption(
                image, 
                "describe the leaf disease symptoms:",
                max_length,
                num_beams
            )
            
            visual_features = self._generate_conditional_caption(
                image,
                "describe the visual appearance and any abnormalities:",
                max_length,
                num_beams
            )
            
            # Compile results
            result = {
                'general_description': caption,
                'disease_symptoms': disease_focused,
                'visual_features': visual_features,
                'combined_description': self._create_combined_description(
                    caption, disease_focused, visual_features
                )
            }
            
            return result
            
        except Exception as e:
            print(f"❌ Error in image analysis: {e}")
            return {
                'general_description': "Unable to analyze image",
                'disease_symptoms': "Analysis failed",
                'visual_features': "Analysis failed",
                'combined_description': f"Error: {str(e)}"
            }
    
    def _generate_caption(self, image, max_length=100, num_beams=4):
        """
        Generate unconditional image caption
        """
        # Preprocess image
        inputs = self.processor(image, return_tensors="pt").to(self.device)
        
        # Generate caption
        with torch.no_grad():
            output = self.model.generate(
                **inputs,
                max_length=max_length,
                num_beams=num_beams,
                early_stopping=True
            )
        
        # Decode caption
        caption = self.processor.decode(output[0], skip_special_tokens=True)
        return caption
    
    def _generate_conditional_caption(self, image, text_prompt, max_length=100, num_beams=4):
        """
        Generate conditional image caption with text prompt
        """
        # Preprocess image and text
        inputs = self.processor(image, text_prompt, return_tensors="pt").to(self.device)
        
        # Generate caption
        with torch.no_grad():
            output = self.model.generate(
                **inputs,
                max_length=max_length,
                num_beams=num_beams,
                early_stopping=True
            )
        
        # Decode caption
        caption = self.processor.decode(output[0], skip_special_tokens=True)
        return caption
    
    def _create_combined_description(self, general, symptoms, features):
        """
        Create a combined, coherent description from multiple captions
        """
        combined = f"Visual Analysis: {general}. "
        
        if symptoms and symptoms != general:
            combined += f"Disease Symptoms: {symptoms}. "
        
        if features and features != general and features != symptoms:
            combined += f"Additional Features: {features}."
        
        return combined.strip()
    
    def get_plant_specific_description(self, image_path, plant_type="plant"):
        """
        Generate plant-specific description
        
        Args:
            image_path: Path to image
            plant_type: Type of plant (tomato, potato, pepper, etc.)
            
        Returns:
            Detailed description focused on plant diseases
        """
        try:
            # Load image
            if isinstance(image_path, str):
                image = Image.open(image_path).convert('RGB')
            else:
                image = image_path.convert('RGB')
            
            # Create plant-specific prompts
            prompts = [
                f"describe the {plant_type} leaf condition:",
                f"what symptoms are visible on this {plant_type} plant:",
                f"identify any abnormalities on the {plant_type} leaves:"
            ]
            
            descriptions = []
            for prompt in prompts:
                desc = self._generate_conditional_caption(image, prompt)
                descriptions.append(desc)
            
            # Return most detailed description
            return max(descriptions, key=len)
            
        except Exception as e:
            return f"Unable to generate plant-specific description: {str(e)}"


def create_llm_prompt_from_blip(blip_result, confidence_score=0.0):
    """
    Create structured prompt for LLM based on BLIP analysis
    
    Args:
        blip_result: Dictionary from BLIPImageAnalyzer.analyze_image()
        confidence_score: Confidence score if CNN was used
        
    Returns:
        Formatted prompt string for LLM
    """
    prompt = f"""Plant Disease Analysis Request:

Visual Description:
{blip_result['combined_description']}

Disease Symptoms Observed:
{blip_result['disease_symptoms']}

Visual Features:
{blip_result['visual_features']}

Note: This analysis is based on visual inspection as the automated classifier had low confidence ({confidence_score:.2%}).

Please provide:
1. Most likely disease or condition based on visual symptoms
2. Possible causes of these symptoms
3. Recommended treatment options
4. Preventive measures for future occurrences

Format your response as a helpful agricultural advisory."""

    return prompt


# Example usage and testing
if __name__ == "__main__":
    print("=" * 70)
    print("BLIP IMAGE ANALYZER - TEST MODULE")
    print("=" * 70)
    
    # Initialize analyzer
    analyzer = BLIPImageAnalyzer()
    
    # Test image path (update with actual path)
    test_image = "path/to/test/image.jpg"
    
    if os.path.exists(test_image):
        print(f"\n📸 Analyzing: {test_image}")
        
        # Analyze image
        result = analyzer.analyze_image(test_image)
        
        # Display results
        print("\n" + "=" * 70)
        print("ANALYSIS RESULTS")
        print("=" * 70)
        print(f"\n📝 General Description:\n{result['general_description']}")
        print(f"\n🔍 Disease Symptoms:\n{result['disease_symptoms']}")
        print(f"\n👁️ Visual Features:\n{result['visual_features']}")
        print(f"\n📋 Combined:\n{result['combined_description']}")
        
        # Create LLM prompt
        print("\n" + "=" * 70)
        print("LLM PROMPT")
        print("=" * 70)
        llm_prompt = create_llm_prompt_from_blip(result, confidence_score=0.45)
        print(llm_prompt)
    else:
        print(f"⚠️ Test image not found: {test_image}")
        print("Please update the test_image path in the script")