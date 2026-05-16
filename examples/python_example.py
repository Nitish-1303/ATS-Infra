"""
ATSInfra Python SDK Example

This example demonstrates how to use the ATSInfra Python SDK
to parse resumes, simulate ATS parsing, and perform semantic matching.
"""

from atsinfra import ATSInfra

# Initialize client
client = ATSInfra(
    api_key="your_api_key_here",  # Optional for self-hosted
    base_url="http://localhost:4000/api/v1"
)

# Example 1: Parse a resume
print("=" * 50)
print("Example 1: Parse Resume")
print("=" * 50)

result = client.parse("resume.pdf")
print(f"Parser: {result.parser}")
print(f"Success: {result.success}")
print(f"\nSections detected:")
for section, data in result.sections.items():
    confidence = data.get('confidence', 0) * 100
    print(f"  - {section}: {confidence:.0f}% confidence")

if result.issues:
    print(f"\nIssues found: {len(result.issues)}")
    for issue in result.issues:
        print(f"  - [{issue['type']}] {issue['message']}")

# Example 2: Simulate ATS parsing
print("\n" + "=" * 50)
print("Example 2: Simulate Workday ATS")
print("=" * 50)

simulation = client.simulate("resume.pdf", ats="workday")
print(f"ATS: {simulation.ats_name}")
print(f"Parse Score: {simulation.parse_score:.1f}%")
print(f"Issues: {len(simulation.issues)}")

# Example 3: Simulate all ATS systems
print("\n" + "=" * 50)
print("Example 3: Simulate All ATS Systems")
print("=" * 50)

all_simulations = client.simulate("resume.pdf", all_systems=True)
for sim in all_simulations.get('results', []):
    print(f"{sim['ats_name']}: {sim['parse_score']:.1f}%")

# Example 4: Repair PDF
print("\n" + "=" * 50)
print("Example 4: Repair ATS-Hostile PDF")
print("=" * 50)

repaired_path = client.repair("resume.pdf", output_path="resume_repaired.pdf")
print(f"Repaired PDF saved to: {repaired_path}")

# Example 5: Semantic matching
print("\n" + "=" * 50)
print("Example 5: Semantic Job Matching")
print("=" * 50)

job_description = """
We're looking for a Senior Software Engineer with:
- 5+ years of Python experience
- Strong background in distributed systems
- Experience with AWS and Kubernetes
- Excellent communication skills
"""

match = client.semantic_match("resume.pdf", job_description)
print(f"Overall Match: {match.overall_match}%")
print(f"Semantic Score: {match.semantic_score}%")
print(f"Literal Score: {match.literal_score}%")

print("\nMatched Skills:")
for skill in match.matched_skills:
    status = "✓" if skill.found else "✗"
    print(f"  {status} {skill.skill} ({skill.confidence * 100:.0f}%)")

if match.missing_capabilities:
    print("\nMissing Capabilities:")
    for capability in match.missing_capabilities:
        print(f"  - {capability}")

if match.recommendations:
    print("\nRecommendations:")
    for i, rec in enumerate(match.recommendations, 1):
        print(f"  {i}. {rec}")

# Example 6: Health check
print("\n" + "=" * 50)
print("Example 6: Health Check")
print("=" * 50)

health = client.health_check()
print(f"Status: {health['status']}")
print(f"Timestamp: {health['timestamp']}")
