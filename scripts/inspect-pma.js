const fs = require('fs');

const html = fs.readFileSync('pma-out.html', 'utf8');
const lines = html.split('\n');

const startIndex = lines.findIndex(l => l.includes('<table class="table table-striped table-hover') || l.includes('table_results'));

if (startIndex !== -1) {
  const endIndex = startIndex + 100;
  console.log('TABLE HTML SNIPPET:');
  console.log(lines.slice(startIndex, endIndex).join('\n'));
} else {
  console.log('Table not found! Dumping some body HTML:');
  const bodyStart = lines.findIndex(l => l.includes('<body'));
  console.log(lines.slice(bodyStart, bodyStart + 50).join('\n'));
}
