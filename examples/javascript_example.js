/**
 * ATSInfra JavaScript SDK Example
 * 
 * This example demonstrates how to use the ATSInfra JavaScript SDK
 * to parse resumes, simulate ATS parsing, and perform semantic matching.
 */

const { ATSInfra } = require('@atsinfra/sdk');

// Initialize client
const client = new ATSInfra({
  apiKey: 'your_api_key_here', // Optional for self-hosted
  baseUrl: 'http://localhost:4000/api/v1',
  timeout: 30000
});

async function main() {
  try {
    // Example 1: Parse a resume
    console.log('='.repeat(50));
    console.log('Example 1: Parse Resume');
    console.log('='.repeat(50));

    const parseResult = await client.parse('resume.pdf');
    console.log(`Parser: ${parseResult.parser}`);
    console.log(`Success: ${parseResult.success}`);
    console.log('\nSections detected:');
    
    Object.entries(parseResult.sections).forEach(([section, data]) => {
      const confidence = (data.confidence || 0) * 100;
      console.log(`  - ${section}: ${confidence.toFixed(0)}% confidence`);
    });

    if (parseResult.issues.length > 0) {
      console.log(`\nIssues found: ${parseResult.issues.length}`);
      parseResult.issues.forEach(issue => {
        console.log(`  - [${issue.type}] ${issue.message}`);
      });
    }

    // Example 2: Simulate ATS parsing
    console.log('\n' + '='.repeat(50));
    console.log('Example 2: Simulate Workday ATS');
    console.log('='.repeat(50));

    const simulation = await client.simulate('resume.pdf', { ats: 'workday' });
    console.log(`ATS: ${simulation.ats_name}`);
    console.log(`Parse Score: ${simulation.parse_score.toFixed(1)}%`);
    console.log(`Issues: ${simulation.issues.length}`);

    // Example 3: Simulate all ATS systems
    console.log('\n' + '='.repeat(50));
    console.log('Example 3: Simulate All ATS Systems');
    console.log('='.repeat(50));

    const allSimulations = await client.simulate('resume.pdf', { all: true });
    allSimulations.results.forEach(sim => {
      console.log(`${sim.ats_name}: ${sim.parse_score.toFixed(1)}%`);
    });

    // Example 4: Repair PDF
    console.log('\n' + '='.repeat(50));
    console.log('Example 4: Repair ATS-Hostile PDF');
    console.log('='.repeat(50));

    const repairedPath = await client.repair('resume.pdf', 'resume_repaired.pdf');
    console.log(`Repaired PDF saved to: ${repairedPath}`);

    // Example 5: Semantic matching
    console.log('\n' + '='.repeat(50));
    console.log('Example 5: Semantic Job Matching');
    console.log('='.repeat(50));

    const jobDescription = `
We're looking for a Senior Software Engineer with:
- 5+ years of Python experience
- Strong background in distributed systems
- Experience with AWS and Kubernetes
- Excellent communication skills
    `;

    const match = await client.semanticMatch('resume.pdf', jobDescription);
    console.log(`Overall Match: ${match.overall_match}%`);
    console.log(`Semantic Score: ${match.semantic_score}%`);
    console.log(`Literal Score: ${match.literal_score}%`);

    console.log('\nMatched Skills:');
    match.matched_skills.forEach(skill => {
      const status = skill.found ? '✓' : '✗';
      console.log(`  ${status} ${skill.skill} (${(skill.confidence * 100).toFixed(0)}%)`);
    });

    if (match.missing_capabilities.length > 0) {
      console.log('\nMissing Capabilities:');
      match.missing_capabilities.forEach(capability => {
        console.log(`  - ${capability}`);
      });
    }

    if (match.recommendations.length > 0) {
      console.log('\nRecommendations:');
      match.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    }

    // Example 6: Health check
    console.log('\n' + '='.repeat(50));
    console.log('Example 6: Health Check');
    console.log('='.repeat(50));

    const health = await client.healthCheck();
    console.log(`Status: ${health.status}`);
    console.log(`Timestamp: ${health.timestamp}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
