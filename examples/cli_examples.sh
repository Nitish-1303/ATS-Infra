#!/bin/bash

# ATSInfra CLI Examples
# This script demonstrates various CLI commands

echo "=========================================="
echo "ATSInfra CLI Examples"
echo "=========================================="

# Example 1: Parse a resume
echo -e "\n1. Parse Resume"
atsinfra parse resume.pdf

# Example 2: Parse and save output to JSON
echo -e "\n2. Parse and Save to JSON"
atsinfra parse resume.pdf --output result.json

# Example 3: Simulate Workday ATS
echo -e "\n3. Simulate Workday ATS"
atsinfra simulate resume.pdf --ats workday

# Example 4: Simulate Greenhouse ATS
echo -e "\n4. Simulate Greenhouse ATS"
atsinfra simulate resume.pdf --ats greenhouse

# Example 5: Simulate all ATS systems
echo -e "\n5. Simulate All ATS Systems"
atsinfra simulate resume.pdf --all

# Example 6: Repair ATS-hostile PDF
echo -e "\n6. Repair PDF"
atsinfra repair resume.pdf --output resume_fixed.pdf

# Example 7: Semantic matching with job description
echo -e "\n7. Semantic Job Matching"
atsinfra semantic-match resume.pdf job_description.txt

# Example 8: Chain commands - parse, simulate, and repair
echo -e "\n8. Complete Analysis Pipeline"
atsinfra parse resume.pdf --output parse_result.json && \
atsinfra simulate resume.pdf --all && \
atsinfra repair resume.pdf --output resume_ats_safe.pdf

echo -e "\n=========================================="
echo "Examples Complete!"
echo "=========================================="
