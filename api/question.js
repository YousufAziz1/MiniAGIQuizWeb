 module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const FALLBACKS = [
    {
      question: "What is SentientAGI's mission?",
      options: [
        'A) Maximize profit',
        'B) Community-owned AI',
        'C) Closed-source AGI',
        'D) Ad targeting',
      ],
      correct: 'B',
      explanation: 'Sentient promotes community-owned AI and open participation.',
    },
    {
      question: 'A key AI ethics concern is?',
      options: ['A) Bias and fairness', 'B) Screen size', 'C) Battery life', 'D) Font style'],
      correct: 'A',
      explanation: 'Ethical AI emphasizes reducing bias and ensuring fairness.',
    },
    {
      question: 'What is Dobby often highlighted for?',
      options: ['A) Loyalty and helpfulness', 'B) Stock trading', 'C) Image filters', 'D) GPS routing'],
      correct: 'A',
      explanation: 'Dobby is framed as a loyal, helpful assistant for builders.',
    },
  ];

  const apiKey = process.env.FIREWORKS_API_KEY;
  const URL = 'https://api.fireworks.ai/inference/v1/completions';
  const MODEL = 'accounts/fireworks/models/dobby-70b-v1';
  const PROMPT =
    'Generate ONE multiple-choice question about AI ethics or SentientAGI projects.\n' +
    'Format EXACTLY:\n' +
    'Question: <text>?\n' +
    'A) <opt1>\n' +
    'B) <opt2>\n' +
    'C) <opt3>\n' +
    'D) <opt4>\n' +
    'Correct: <A/B/C/D>\n' +
    'Explanation: <short>\n';

  async function getFromApi() {
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') throw new Error('No API key');
    const r = await fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: MODEL, prompt: PROMPT, max_tokens: 220, temperature: 0.7 }),
    });
    const j = await r.json();
    const txt = (j.completions && j.completions[0] && j.completions[0].text) || '';
    // Parse
    const qm = txt.match(/Question:\s*(.*)\?/);
    const opts = txt.match(/^[ABCD]\)\s.*$/gm) || [];
    const cm = txt.match(/Correct:\s*([ABCD])/);
    const em = txt.match(/Explanation:\s*(.*)/);
    if (!qm || opts.length !== 4 || !cm || !em) throw new Error('Bad format');
    return {
      question: qm[1].trim() + '?',
      options: opts.map((s) => s.trim()),
      correct: cm[1].toUpperCase(),
      explanation: em[1].trim(),
    };
  }

  try {
    const data = await getFromApi();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (e) {
    const fb = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(fb);
  }
}
