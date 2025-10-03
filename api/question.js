 module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const FALLBACKS = [
    {
      question: "What is SentientAGI's main mission?",
      options: [
        'A) To create closed-source AI for big tech companies',
        'B) To build open-source AGI that is loyal, owned, and aligned by the community',
        'C) To focus only on video game AI',
        'D) To sell AI hardware',
      ],
      correct: 'B',
      explanation: "SentientAGI aims to put 'Loyal AI for all' in the hands of billions, ensuring it's community-built and owned, not controlled by any single entity.",
    },
    {
      question: 'What is "The GRID" in SentientAGI?',
      options: [
        'A) A social media platform for AI users',
        "B) The world's largest open-source AGI network for building and sharing AI agents",
        'C) A hardware device for running AI',
        'D) An app for chatting with celebrities',
      ],
      correct: 'B',
      explanation: "Launched in 2025, The GRID is Sentient's decentralized network that makes open-source AI the default, allowing developers to monetize agents.",
    },
    {
      question: 'Who is Dobby in the context of SentientAGI?',
      options: [
        'A) A fictional character from a book',
        "B) The community's loyal AI model that users can shape and own",
        "C) SentientAGI's CEO",
        'D) A type of computer virus',
      ],
      correct: 'B',
      explanation: "Dobby is Sentient's flagship AI model, designed to be 'owned by you, controlled by you, aligned to you'—the community decides its personality and use.",
    },
    {
      question: 'What does "Model Loyalty" mean in SentientAGI\'s protocol?',
      options: [
        'A) AI models that only work for one company',
        'B) A feature ensuring AI stays aligned with user values and community decisions',
        'C) Loyalty programs for buying AI subscriptions',
        'D) AI that plays loyalty card games',
      ],
      correct: 'B',
      explanation: "Model Loyalty is a key innovation in Sentient's open-source protocol, keeping AI true to human-like randomness and community ethics.",
    },
    {
      question: 'What is the OML format introduced by SentientAGI?',
      options: [
        'A) A new video file type',
        'B) An open format for representing and sharing AI models in their protocol',
        'C) A music playlist for AI training',
        'D) A map of AI data centers',
      ],
      correct: 'B',
      explanation: "OML (Open Model Loyalty) enables community-built AGI by allowing models to be shared, monetized, and kept loyal in Sentient's ecosystem.",
    },
    {
      question: 'Who is a co-founder of SentientAGI?',
      options: [
        'A) Elon Musk',
        'B) Sandeep Nailwal (co-founder of Polygon)',
        'C) Mark Zuckerberg',
        'D) Tim Cook',
      ],
      correct: 'B',
      explanation: 'Sandeep Nailwal, known for Polygon blockchain, co-founded Sentient to drive open AGI, including campus tours and partnerships.',
    },
    {
      question: 'What is the Sentient Verifiable Compute Consortium?',
      options: [
        'A) A group for verifying fake news',
        'B) A partnership to bring trusted, decentralized AI compute power',
        'C) A cooking club for AI engineers',
        'D) A sports team for coders',
      ],
      correct: 'B',
      explanation: "Announced in 2025, it's a consortium with partners to ensure verifiable, open AI computation, building on Sentient's data consortium.",
    },
    {
      question: 'How does SentientAGI emphasize AI ethics?',
      options: [
        'A) By ignoring human values for speed',
        "B) By focusing on utility plus matching human intelligence's randomness and values",
        'C) Only through paid ethics courses',
        'D) By banning all AI discussions',
      ],
      correct: 'B',
      explanation: "Sentient defines 'good' AI beyond utility—it's about encompassing human-like unpredictability and aligning with community values for ethical use.",
    },
    {
      question: 'What recent event did SentientAGI host with Sandeep Nailwal?',
      options: [
        'A) A music concert',
        'B) Campus tours at universities like Fudan and Shenzhen to promote open AI',
        'C) A cooking show',
        'D) A car race',
      ],
      correct: 'B',
      explanation: 'In late 2025, they kicked off tours to educate students on open-source AGI, highlighting projects like ROMA and The GRID.',
    },
    {
      question: 'Why did SentientAGI partner with Sidekick Labs?',
      options: [
        'A) To build flying cars',
        "B) To integrate Sentient Chat for streamers' content creation and asset research",
        'C) To design fashion AI',
        'D) To create pet robots',
      ],
      correct: 'B',
      explanation: "The partnership lets streamers use Sentient's AI tools for real-time research and trading, showcasing practical applications in content creation.",
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
    if (!apiKey || apiKey === 'fw_3ZU69PoJkAUMkwokbQHfch6G') throw new Error('No API key');
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


