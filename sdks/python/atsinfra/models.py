"""ATSInfra Data Models"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass


@dataclass
class ParseResult:
    """Resume parsing result"""
    success: bool
    parser: str
    sections: Dict[str, Any]
    raw_text: str
    metadata: Dict[str, Any]
    confidence_scores: Dict[str, float]
    issues: List[Dict[str, str]]


@dataclass
class SimulationResult:
    """ATS simulation result"""
    ats_name: str
    parse_score: float
    sections: Dict[str, Any]
    issues: List[Dict[str, str]]
    confidence: Dict[str, float]


@dataclass
class MatchedSkill:
    """Matched skill information"""
    skill: str
    confidence: float
    found: bool


@dataclass
class SemanticMatch:
    """Semantic matching result"""
    overall_match: float
    semantic_score: float
    literal_score: float
    matched_skills: List[MatchedSkill]
    missing_capabilities: List[str]
    recommendations: List[str]
