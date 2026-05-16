#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { table } from 'table';

const program = new Command();

const API_URL = process.env.ATSINFRA_API_URL || 'http://localhost:4000/api/v1';

program
  .name('atsinfra')
  .description('ATSInfra CLI - Infrastructure-grade ATS Resume Debugger')
  .version('0.1.0');

// Parse command
program
  .command('parse <file>')
  .description('Parse resume and extract structured data')
  .option('-o, --output <file>', 'Output file for JSON result')
  .action(async (file: string, options: any) => {
    const spinner = ora('Parsing resume...').start();

    try {
      if (!await fs.pathExists(file)) {
        spinner.fail(chalk.red(`File not found: ${file}`));
        process.exit(1);
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(file));

      const response = await axios.post(`${API_URL}/parse`, formData, {
        headers: formData.getHeaders(),
      });

      spinner.succeed(chalk.green('Resume parsed successfully!'));

      console.log('\n' + chalk.bold('Parse Results:'));
      console.log(chalk.cyan('Parser:'), response.data.parser);
      console.log(chalk.cyan('Success:'), response.data.success ? '✓' : '✗');

      if (response.data.sections) {
        console.log('\n' + chalk.bold('Sections Detected:'));
        Object.entries(response.data.sections).forEach(([section, data]: [string, any]) => {
          const status = data.parsed ? chalk.green('✓') : chalk.red('✗');
          const confidence = data.confidence ? `(${(data.confidence * 100).toFixed(0)}%)` : '';
          console.log(`  ${status} ${section} ${confidence}`);
        });
      }

      if (response.data.issues && response.data.issues.length > 0) {
        console.log('\n' + chalk.bold('Issues:'));
        response.data.issues.forEach((issue: any) => {
          const icon = issue.type === 'error' ? '✗' : '⚠';
          console.log(`  ${icon} ${issue.message}`);
        });
      }

      if (options.output) {
        await fs.writeJson(options.output, response.data, { spaces: 2 });
        console.log(chalk.green(`\nResults saved to ${options.output}`));
      }
    } catch (error: any) {
      spinner.fail(chalk.red('Failed to parse resume'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Simulate command
program
  .command('simulate <file>')
  .description('Simulate ATS parsing behavior')
  .option('-a, --ats <name>', 'ATS system to simulate (workday, greenhouse, lever)', 'workday')
  .option('--all', 'Simulate all ATS systems')
  .action(async (file: string, options: any) => {
    const spinner = ora('Simulating ATS parsing...').start();

    try {
      if (!await fs.pathExists(file)) {
        spinner.fail(chalk.red(`File not found: ${file}`));
        process.exit(1);
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(file));

      const endpoint = options.all ? '/simulate-all' : `/simulate?ats=${options.ats}`;
      const response = await axios.post(`${API_URL}${endpoint}`, formData, {
        headers: formData.getHeaders(),
      });

      spinner.succeed(chalk.green('Simulation complete!'));

      if (options.all) {
        console.log('\n' + chalk.bold('ATS Simulation Results:'));
        
        const data = response.data.results.map((result: any) => [
          result.ats_name,
          `${result.parse_score.toFixed(1)}%`,
          result.issues.length,
        ]);

        console.log(table([
          [chalk.bold('ATS System'), chalk.bold('Score'), chalk.bold('Issues')],
          ...data
        ]));

        console.log(chalk.cyan('Overall Score:'), `${response.data.overall_score.toFixed(1)}%`);
      } else {
        console.log('\n' + chalk.bold(`${response.data.ats_name} Simulation:`));
        console.log(chalk.cyan('Parse Score:'), `${response.data.parse_score.toFixed(1)}%`);
        console.log(chalk.cyan('Issues Found:'), response.data.issues.length);

        if (response.data.issues.length > 0) {
          console.log('\n' + chalk.bold('Issues:'));
          response.data.issues.forEach((issue: any) => {
            console.log(`  ⚠ ${issue.message}`);
          });
        }
      }
    } catch (error: any) {
      spinner.fail(chalk.red('Simulation failed'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Repair command
program
  .command('repair <file>')
  .description('Repair ATS-hostile PDF')
  .option('-o, --output <file>', 'Output file for repaired PDF', 'repaired.pdf')
  .action(async (file: string, options: any) => {
    const spinner = ora('Repairing PDF...').start();

    try {
      if (!await fs.pathExists(file)) {
        spinner.fail(chalk.red(`File not found: ${file}`));
        process.exit(1);
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(file));

      const response = await axios.post(`${API_URL}/repair`, formData, {
        headers: formData.getHeaders(),
        responseType: 'arraybuffer',
      });

      await fs.writeFile(options.output, response.data);

      spinner.succeed(chalk.green(`PDF repaired successfully!`));
      console.log(chalk.cyan('Output:'), options.output);
    } catch (error: any) {
      spinner.fail(chalk.red('Failed to repair PDF'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Semantic match command
program
  .command('semantic-match <resume> <job-description>')
  .description('Perform semantic matching between resume and job description')
  .action(async (resume: string, jobDescription: string) => {
    const spinner = ora('Analyzing semantic match...').start();

    try {
      if (!await fs.pathExists(resume)) {
        spinner.fail(chalk.red(`Resume file not found: ${resume}`));
        process.exit(1);
      }

      if (!await fs.pathExists(jobDescription)) {
        spinner.fail(chalk.red(`Job description file not found: ${jobDescription}`));
        process.exit(1);
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(resume));
      formData.append('job_description', await fs.readFile(jobDescription, 'utf-8'));

      const response = await axios.post(`${API_URL}/semantic-match`, formData, {
        headers: formData.getHeaders(),
      });

      spinner.succeed(chalk.green('Semantic analysis complete!'));

      console.log('\n' + chalk.bold('Match Results:'));
      console.log(chalk.cyan('Overall Match:'), `${response.data.overall_match}%`);
      console.log(chalk.cyan('Semantic Score:'), `${response.data.semantic_score}%`);
      console.log(chalk.cyan('Literal Score:'), `${response.data.literal_score}%`);

      if (response.data.matched_skills) {
        console.log('\n' + chalk.bold('Skill Matching:'));
        response.data.matched_skills.forEach((skill: any) => {
          const status = skill.found ? chalk.green('✓') : chalk.red('✗');
          console.log(`  ${status} ${skill.skill} (${(skill.confidence * 100).toFixed(0)}%)`);
        });
      }

      if (response.data.recommendations) {
        console.log('\n' + chalk.bold('Recommendations:'));
        response.data.recommendations.forEach((rec: string, i: number) => {
          console.log(`  ${i + 1}. ${rec}`);
        });
      }
    } catch (error: any) {
      spinner.fail(chalk.red('Semantic matching failed'));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program.parse();
