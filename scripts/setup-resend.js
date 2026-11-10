#!/usr/bin/env node

/**
 * Interactive setup script for Resend Contact Form Integration.
 * Configures RESEND_API_KEY and CONTACT_EMAIL in the project root .env file.
 * Handles secret inputs securely without echoing them to stdout or logs.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(PROJECT_ROOT, '.env');
const GITIGNORE_PATH = path.join(PROJECT_ROOT, '.gitignore');

// Helper: prompt for hidden input (never echoed to terminal)
function askHidden(promptText) {
  return new Promise((resolve) => {
    process.stdout.write(promptText);

    if (!process.stdin.isTTY) {
      // Fallback for non-interactive / piped environments
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('', (ans) => {
        rl.close();
        resolve(ans.trim());
      });
      return;
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    let input = '';
    const onData = (chunk) => {
      const str = chunk.toString('utf8');
      for (const char of str) {
        if (char === '\n' || char === '\r' || char === '\u0004') {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener('data', onData);
          process.stdout.write('\n');
          resolve(input.trim());
          return;
        } else if (char === '\u0003') {
          // Ctrl+C
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener('data', onData);
          process.stdout.write('\n\nSetup aborted by user.\n');
          process.exit(130);
        } else if (char === '\u0008' || char === '\x7f') {
          // Backspace
          if (input.length > 0) {
            input = input.slice(0, -1);
          }
        } else if (char.charCodeAt(0) >= 32) {
          // Append printable character (hidden, not echoed)
          input += char;
        }
      }
    };

    process.stdin.on('data', onData);
  });
}

// Helper: prompt for visible input
function askVisible(promptText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Ensure .env is in .gitignore
function ensureGitignore(gitignorePath) {
  try {
    if (!fs.existsSync(gitignorePath)) {
      fs.writeFileSync(gitignorePath, '# local env files\n.env\n.env*.local\n', 'utf8');
      return true;
    }
    const content = fs.readFileSync(gitignorePath, 'utf8');
    const lines = content.split(/\r?\n/).map((l) => l.trim());
    if (!lines.includes('.env')) {
      const updated = content.trimEnd() + '\n\n# local env files\n.env\n';
      fs.writeFileSync(gitignorePath, updated, 'utf8');
    }
    return true;
  } catch (err) {
    console.error('Warning: Could not update .gitignore:', err.message);
    return false;
  }
}

// Safely update or add variables in .env without overwriting other variables
function updateEnvFile(envPath, updates) {
  let content = '';
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8');
  }

  const lines = content.length > 0 ? content.split(/\r?\n/) : [];
  const handled = new Set();

  const newLines = lines.map((line) => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (match) {
      const key = match[1];
      if (key in updates) {
        handled.add(key);
        return `${key}="${updates[key]}"`;
      }
    }
    return line;
  });

  const toAppend = [];
  for (const [key, val] of Object.entries(updates)) {
    if (!handled.has(key)) {
      toAppend.push(`${key}="${val}"`);
    }
  }

  if (toAppend.length > 0) {
    if (newLines.length > 0 && newLines[newLines.length - 1].trim() !== '') {
      newLines.push('');
    }
    if (newLines.length === 0) {
      newLines.push('# Resend Contact Form Configuration');
    }
    newLines.push(...toAppend);
  }

  const finalContent = newLines.join('\n').trim() + '\n';
  fs.writeFileSync(envPath, finalContent, 'utf8');
}

// Verify configuration without exposing secrets
function verifyConfiguration(envPath) {
  if (!fs.existsSync(envPath)) {
    return { ok: false, error: '.env file was not created.' };
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const apiKeyMatch = content.match(/^\s*RESEND_API_KEY\s*=\s*["']?([^"'\r\n]+)["']?/m);
  const emailMatch = content.match(/^\s*CONTACT_EMAIL\s*=\s*["']?([^"'\r\n]+)["']?/m);

  const hasApiKey = !!(apiKeyMatch && apiKeyMatch[1] && apiKeyMatch[1].trim().length > 0);
  const hasEmail = !!(emailMatch && emailMatch[1] && emailMatch[1].trim().length > 0);

  return {
    ok: hasApiKey && hasEmail,
    hasApiKey,
    apiKeyMasked: hasApiKey
      ? (apiKeyMatch[1].startsWith('re_') ? 're_' : '') + '•'.repeat(Math.min(24, Math.max(8, apiKeyMatch[1].length - 3)))
      : null,
    apiKeyLength: hasApiKey ? apiKeyMatch[1].length : 0,
    contactEmail: hasEmail ? emailMatch[1] : null,
  };
}

async function main() {
  console.log('\n======================================================');
  console.log('       Resend Contact Form Setup');
  console.log('======================================================');
  console.log('This script securely configures credentials for your contact form.');
  console.log('• Target file: .env (project root)');
  console.log('• Your API key is hidden while typing and will never be logged.\n');

  // 1. Prompt for Resend API Key securely
  let apiKey = '';
  while (!apiKey) {
    apiKey = await askHidden('1. Enter your Resend API Key (hidden while typing): ');
    if (!apiKey) {
      console.log('   ⚠️  API key cannot be empty. Please try again.\n');
    } else if (!apiKey.startsWith('re_')) {
      console.log('   ℹ️  Note: Resend API keys typically start with "re_".');
      const confirm = await askVisible('   Use this key anyway? (y/n): ');
      if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
        apiKey = '';
        console.log('');
      }
    }
  }

  // 2. Prompt for destination email address
  let email = '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  while (!email) {
    email = await askVisible('2. Enter email address to receive contact form messages: ');
    if (!email) {
      console.log('   ⚠️  Email cannot be empty. Please try again.\n');
    } else if (!emailRegex.test(email)) {
      console.log('   ⚠️  Invalid email address format. Please try again.\n');
      email = '';
    }
  }

  console.log('\nSaving configuration...');

  // 3. Ensure .env is ignored by Git
  ensureGitignore(GITIGNORE_PATH);

  // 4. Update .env file safely
  updateEnvFile(ENV_PATH, {
    RESEND_API_KEY: apiKey,
    CONTACT_EMAIL: email,
  });

  // 5. Verify the configuration safely
  const verification = verifyConfiguration(ENV_PATH);

  if (verification.ok) {
    console.log('\n✔ Configuration saved successfully!\n');
    console.log('Configuration Summary:');
    console.log(`  • File:          ${ENV_PATH}`);
    console.log(`  • RESEND_API_KEY: [Configured] (${verification.apiKeyMasked}, ${verification.apiKeyLength} chars)`);
    console.log(`  • CONTACT_EMAIL:  ${verification.contactEmail}`);
    console.log(`  • .gitignore:    Verified (.env is protected from commits)\n`);
    console.log('To change or update your credentials at any time, run:');
    console.log('  npm run setup:resend\n');
  } else {
    console.error('\n❌ Verification failed. Please check file permissions and try again.\n');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('\nUnexpected error during setup:', err.message);
    process.exit(1);
  });
}

module.exports = {
  updateEnvFile,
  verifyConfiguration,
  ensureGitignore,
};
