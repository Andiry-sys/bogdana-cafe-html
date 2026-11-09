# First-screen attention check

`attention-desktop.jpg`, `attention-mobile.jpg` — predicted attention heatmaps of the first screen
(red/yellow = most likely looked at first). Made with **hotgaze** (offline, MIT) using its *fast* heuristic
backend (contrast + spectral residual + centre bias). It is a rough hint, not eye-tracking: it underrates
photos/food and overrates big text. Re-check with real photos of the client's pizza.

Current reading: the headline «Піца на живій заквасці», «Без дріжджів» and the «Зателефонувати» button get
the attention; the pizza illustration gets less (expected to change with a real appetising photo).

## Tools to test it yourself
| Tool | Type | Cost | How |
| --- | --- | --- | --- |
| hotgaze (`pip install hotgaze`) | AI prediction, offline | free | `hotgaze run screenshot.png` (deep model: `pip install hotgaze[deep]`) |
| Hostinger AI Heatmap — hostinger.com/ai-heatmap | AI prediction | a few free uses (account needed) | upload a screenshot |
| Attention Insight — attentioninsight.com | AI prediction (+ clarity score, areas of interest) | 14-day free trial, then paid | upload image or URL |
| Expoze.io (Chrome extension) | AI prediction | free extension, paid Pro | run on the open page |
| Lyssna five-second test — lyssna.com | real people see the page 5 s, then answer questions | free sign-up; paid panel | upload screenshot, ask "What does this place sell? How do you order?" |
| Microsoft Clarity — clarity.microsoft.com | real visitors: heatmaps, scroll maps, recordings | free | paste the snippet from the ANALYTICS block in `<head>` |

Tip: the cheapest honest test — show the phone screenshot to 5 people for 5 seconds and ask:
"What is it? Where is it? How do I order?" If all three answers come back, the first screen works.
