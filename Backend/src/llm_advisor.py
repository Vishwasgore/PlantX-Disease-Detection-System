"""
TinyLLaMA Advisory System via Ollama
Provides detailed agricultural advice based on disease detection
"""

import requests
import json
from typing import Dict, Optional


class AgricultureAdvisor:
    """
    LLM-based agricultural advisory system using TinyLLaMA
    """
    
    def __init__(self, ollama_url="http://localhost:11434", model_name="tinyllama"):
        """
        Initialize the advisor
        
        Args:
            ollama_url: URL for Ollama API
            model_name: Name of the model to use (tinyllama by default)
        """
        self.ollama_url = ollama_url
        self.model_name = model_name
        self.api_endpoint = f"{ollama_url}/api/generate"
        
        print(f"🔧 Initializing Agriculture Advisor with {model_name}...")
        
        # Verify Ollama is running
        if not self._check_ollama_connection():
            raise ConnectionError(
                "Cannot connect to Ollama. Please ensure Ollama is running.\n"
                "Install: https://ollama.ai/download\n"
                "Start: ollama serve\n"
                f"Pull model: ollama pull {model_name}"
            )
        
        print("✅ Connected to Ollama successfully")
    
    def _check_ollama_connection(self):
        """
        Check if Ollama is running and accessible
        """
        try:
            response = requests.get(f"{self.ollama_url}/api/tags", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def get_advice_for_cnn_prediction(
        self, 
        disease_name: str, 
        confidence: float,
        plant_type: str = "unknown"
    ) -> Dict[str, str]:
        """
        Get agricultural advice based on CNN prediction
        
        Args:
            disease_name: Name of detected disease
            confidence: Confidence score of prediction
            plant_type: Type of plant (tomato, potato, etc.)
            
        Returns:
            Dictionary with structured advice
        """
        # Create detailed prompt
        prompt = self._create_cnn_prompt(disease_name, confidence, plant_type)
        
        # Get LLM response
        response = self._query_llm(prompt)
        
        # Parse and structure response
        structured_response = self._parse_llm_response(response, disease_name, confidence)
        
        return structured_response
    
    def get_advice_for_blip_analysis(
        self, 
        visual_description: str,
        blip_result: Dict
    ) -> Dict[str, str]:
        """
        Get agricultural advice based on BLIP visual analysis
        
        Args:
            visual_description: Combined visual description from BLIP
            blip_result: Full BLIP analysis result
            
        Returns:
            Dictionary with structured advice
        """
        # Create prompt from visual analysis
        prompt = self._create_blip_prompt(visual_description, blip_result)
        
        # Get LLM response
        response = self._query_llm(prompt)
        
        # Parse and structure response
        structured_response = self._parse_llm_response(
            response, 
            "Visual Analysis Based", 
            0.0,
            is_blip=True
        )
        
        return structured_response
    
    def _create_cnn_prompt(self, disease_name: str, confidence: float, plant_type: str) -> str:
        """
        Create prompt for CNN-based detection
        """
        # Parse disease information
        is_healthy = 'healthy' in disease_name.lower()
        
        if is_healthy:
            prompt = f"""You are an expert agricultural advisor. A {plant_type} plant has been analyzed and appears to be HEALTHY with {confidence:.1%} confidence.

Please provide:
1. Confirmation of healthy status
2. Best practices to maintain plant health
3. Common threats to watch for in {plant_type} plants
4. Preventive care recommendations

Keep the advice practical, specific to {plant_type}, and encouraging for the farmer."""
        else:
            prompt = f"""You are an expert agricultural advisor. A {plant_type} plant has been diagnosed with: {disease_name}
Detection Confidence: {confidence:.1%}

Please provide comprehensive advice including:

1. DISEASE OVERVIEW
   - Brief description of {disease_name}
   - Why this disease occurs
   - Risk level assessment

2. SYMPTOMS TO VERIFY
   - Key visual symptoms to confirm diagnosis
   - Disease progression stages

3. TREATMENT RECOMMENDATIONS
   - Immediate actions to take
   - Organic/chemical treatment options
   - Application methods and timing

4. PREVENTIVE MEASURES
   - Cultural practices to prevent recurrence
   - Environmental management
   - Crop rotation suggestions

5. ADDITIONAL NOTES
   - Expected recovery timeline
   - When to seek professional help
   - Economic impact considerations

Keep the advice practical, actionable, and specific to {plant_type} cultivation."""

        return prompt
    
    def _create_blip_prompt(self, visual_description: str, blip_result: Dict) -> str:
        """
        Create prompt for BLIP-based analysis
        """
        prompt = f"""You are an expert agricultural advisor. A plant image has been analyzed visually because automated disease classification was uncertain.

VISUAL ANALYSIS:
{visual_description}

OBSERVED SYMPTOMS:
{blip_result.get('disease_symptoms', 'Not available')}

VISUAL FEATURES:
{blip_result.get('visual_features', 'Not available')}

Based on these visual observations, please provide:

1. POSSIBLE DIAGNOSES
   - Most likely disease or condition (list top 3 possibilities)
   - Reasoning for each possibility

2. VISUAL SYMPTOM INTERPRETATION
   - What the observed symptoms typically indicate
   - Severity assessment

3. RECOMMENDED ACTIONS
   - Immediate steps to take
   - Diagnostic tests or further examination needed
   - Treatment options for each likely diagnosis

4. PREVENTIVE MEASURES
   - General plant health recommendations
   - Environmental factors to monitor

Note: Since this is based on visual analysis only, recommend consulting with a local agricultural extension office for definitive diagnosis if symptoms worsen."""

        return prompt
    
    def _query_llm(self, prompt: str, temperature: float = 0.7, max_tokens: int = 1000) -> str:
        """
        Query TinyLLaMA via Ollama API
        
        Args:
            prompt: Input prompt
            temperature: Sampling temperature
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated text response
        """
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        
        try:
            response = requests.post(
                self.api_endpoint,
                json=payload,
                timeout=120  # 2 minutes timeout for CPU inference
            )
            response.raise_for_status()
            
            result = response.json()
            return result.get('response', 'No response generated')
            
        except requests.exceptions.Timeout:
            return "Error: Request timed out. TinyLLaMA may be processing slowly on CPU."
        except requests.exceptions.RequestException as e:
            return f"Error querying LLM: {str(e)}"
    
    def _parse_llm_response(
        self, 
        response: str, 
        disease_name: str, 
        confidence: float,
        is_blip: bool = False
    ) -> Dict[str, str]:
        """
        Parse and structure LLM response
        
        Args:
            response: Raw LLM response
            disease_name: Disease name
            confidence: Confidence score
            is_blip: Whether this is from BLIP analysis
            
        Returns:
            Structured dictionary with parsed sections
        """
        return {
            'diagnosis': disease_name,
            'confidence': confidence,
            'source': 'Visual Analysis (BLIP)' if is_blip else 'CNN Classification',
            'full_advice': response,
            'summary': self._extract_summary(response),
            'timestamp': self._get_timestamp()
        }
    
    def _extract_summary(self, response: str, max_length: int = 200) -> str:
        """
        Extract a brief summary from the full response
        """
        # Simple extraction: first paragraph or first max_length characters
        paragraphs = response.split('\n\n')
        if paragraphs:
            first_para = paragraphs[0].strip()
            if len(first_para) <= max_length:
                return first_para
            else:
                return first_para[:max_length].rsplit(' ', 1)[0] + '...'
        return response[:max_length].rsplit(' ', 1)[0] + '...'
    
    def _get_timestamp(self) -> str:
        """
        Get current timestamp
        """
        from datetime import datetime
        return datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    def format_for_display(self, advice: Dict[str, str]) -> str:
        """
        Format advice dictionary for user-friendly display
        
        Args:
            advice: Dictionary from get_advice_* methods
            
        Returns:
            Formatted string for display
        """
        output = f"""
{'='*70}
AGRICULTURAL ADVISORY REPORT
{'='*70}

Diagnosis: {advice['diagnosis']}
Confidence: {advice['confidence']:.1%}
Source: {advice['source']}
Timestamp: {advice['timestamp']}

{'='*70}
DETAILED ADVICE
{'='*70}

{advice['full_advice']}

{'='*70}
"""
        return output


# Example usage
if __name__ == "__main__":
    print("=" * 70)
    print("TINYLLAMA AGRICULTURAL ADVISOR - TEST MODULE")
    print("=" * 70)
    
    try:
        # Initialize advisor
        advisor = AgricultureAdvisor()
        
        # Test 1: CNN prediction scenario
        print("\n📊 Test 1: CNN Prediction Scenario")
        print("-" * 70)
        
        advice = advisor.get_advice_for_cnn_prediction(
            disease_name="Tomato - Late Blight",
            confidence=0.87,
            plant_type="Tomato"
        )
        
        print(advisor.format_for_display(advice))
        
        # Test 2: BLIP analysis scenario
        print("\n📊 Test 2: BLIP Visual Analysis Scenario")
        print("-" * 70)
        
        blip_result = {
            'general_description': 'a plant with brown spots on leaves',
            'disease_symptoms': 'leaves showing discoloration and possible fungal infection',
            'visual_features': 'irregular brown patches with yellow halos',
            'combined_description': 'The plant shows brown spots with yellow halos, suggesting possible fungal infection'
        }
        
        advice = advisor.get_advice_for_blip_analysis(
            visual_description=blip_result['combined_description'],
            blip_result=blip_result
        )
        
        print(advisor.format_for_display(advice))
        
    except ConnectionError as e:
        print(f"\n❌ Connection Error: {e}")
    except Exception as e:
        print(f"\n❌ Error: {e}")