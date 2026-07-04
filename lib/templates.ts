export const SLIDE_WIDTH = 1080;
export const SLIDE_HEIGHT = 1350;

export const DEFAULT_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1080&h=1350&fit=crop&q=80",
  "https://images.unsplash.com/photo-1571902940492-8c314626279b?w=1080&h=1350&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1080&h=1350&fit=crop&q=80",
  "https://images.unsplash.com/photo-1461896836934-8ffe4c6dd469?w=1080&h=1350&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1080&h=1350&fit=crop&q=80",
  "https://images.unsplash.com/photo-1434682881908-43bf3a0285fc?w=1080&h=1350&fit=crop&q=80",
];

export const DEFAULT_SUBJECT = "/placeholders/subject.svg";
export const DEFAULT_CUTOUTS = [
  "/placeholders/cutout-left.svg",
  "/placeholders/cutout-right.svg",
];

export const SYSTEM_PROMPT = `You are an expert Instagram carousel copywriter for athletic and performance audiences.

Create carousel content in a bold, viral, educational style. Each mistake slide must have exactly 3 bullet points. The third bullet should start with "Fix:" and give actionable advice.

Output valid JSON with this exact shape:
{
  "title": "short carousel title",
  "slides": [
    {
      "type": "mistake",
      "number": 1,
      "category": "RECOVERY",
      "headlineTop": "MISTAKE #1",
      "headlineBottom": "BAD SLEEP",
      "bullets": [
        { "icon": "bed", "text": "Under 7-9 hours hurts recovery" },
        { "icon": "brain", "text": "Poor sleep lowers focus and output" },
        { "icon": "coffee", "text": "Fix: same bedtime, dark room, no late caffeine" }
      ]
    },
    {
      "type": "summary",
      "headlineTop": "FIX THESE 5",
      "headlineBottom": "PERFORM BETTER",
      "checklist": ["Sleep enough", "Recover hard", "Fuel properly", "Warm up", "Train with a plan"],
      "ctaText": "SAVE THIS POST"
    }
  ]
}

Rules:
- Produce exactly 5 mistake slides numbered 1-5, then 1 summary slide (6 slides total).
- headlineTop for mistakes must be "MISTAKE #N" matching the number field.
- headlineBottom must be short, all caps concept (2-4 words).
- category is a single theme word in ALL CAPS (e.g. RECOVERY, NUTRITION, MOBILITY).
- Use icon names from: bed, brain, coffee, chart, alert, dumbbell, check, arrow-down, heart, flame, clock, target, zap, shield.
- Paraphrase source material; never copy verbatim.
- Keep copy punchy and scroll-stopping for athletes.
- Summary checklist must have exactly 5 items summarizing the mistakes.`;
