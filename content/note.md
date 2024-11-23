# Example

## Content

### Date Start / End

Date atart and end can be indiviadually or completely omitted.
End can be a word.

```json
"dateStart": "2021",
"dateEnd": "2022",
```

Depending on data generated text like this:

| Start | End        |                        |
| ----- | ---------- | ---------------------- |
| 2021  | unfinished | From 2021, unfinished. |
| 2022  | 2023       | From 2022 to 2022      |
| 2022  |            | Started 2021           |
|       | 2022       | Finished 2022          |

### Satus

can be omitted

```json
"status": "paused",
```

### Complete example

```json
{
    "headline": "HANDS",
    "sub": "Lovecraftian Extreme Rock Paper Scissors.",
    "tags": [
    "game",
    "code",
    "GameMaker",
    "GameMakerLang.",
    "game-design",
    "system-design",
    "game-programming",
    "ai-programming",
    "gameplay-engineer",
    "technical-art",
    "asset-art",
    "visual-design"
    ],
    "dateStart": "2021",
    "dateEnd": "unfinished",
    "status": "paused",
    "content": [
    {
        "type": "image",
        "URL": "./content/HANDS.gif",
        "alt": "A GIF of my game, HANDS. Rock Paper Scissors but weird."
    },
    {
        "type": "text",
        "text": "This Game Project was made in Game Maker 2, as a personal project in my free time, started in 2021.\n\nFor Hands, I started out with 2 Ideas.\nI have a deep respect for games simple rule sets, so I wanted to explore that.\nAdditionally, I dislike making my own assets, but I'm never content with 3rd party assets.\nSo I wanted to test how far I could make it with just 1ish sprite.\n\nGod is dead, and all that's left is his corpse, angels and some fading souls.\nYou have the chance to ascend to godhood to take the empty throne, but thy must take the trial of hands.\n\nBorrowing from Judaist beliefs, the space of existence is inside god, who is dead.\nSo I wanted to make every bit of the game feel as weird as possible.\nIn many design decisions, I oriented my design around the feeling you would get when viewing a living organism from the inside.\nWhich everything being in motion constantly and reacting to your actions with more writhing, and pulsing.\n\nGameplay wise, early on I thought about basic rock paper scissors with some minor modification. This proved, far more difficult, than imagined. Altering one thing would throw out the balance of another.\n\nAt the moment, the gameplay is still in early stages.\nAll rules are configurable, so one can create their own game within limitations.\nAfter some more work, I would publish this version.\nWith the intent to hopefully find the best version of the rules with the feedback.\n\nEarly on, I tried to find ways to build the game without using text, which wasn't feasible.\nI may revisit this idea. I would love to make the game so otherworldly that every second with it feels alienating. And forgoing a normalcy such as text would certainly work towards this alienation.\n\nAfter telling some of my colleagues about the game, one noted how much it sounded like a simple fighting game.\nI was surprised by that comparison, but they were completely right.\nOwing to me having absolutely no experience with fighting games, I didn't see the obvious comparison."
    },
    ],
    "footer": {
    "repo": "https://github.com/DodgyMerchant/HANDS",
    "links": [
        {
        "text": "Project GIFs: ",
        "URL": "https://gfycat.com/@hiro_hunter/collections/Y5j3siTT/hands"
        }
    ]
    }
},
```
