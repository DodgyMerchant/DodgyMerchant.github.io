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

### Language

The language the project is in.

```json
"language": "german",
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
    "language": "english",
    "status": "stopped",
    "iFrameSrc": "/content/HANDS/HANDS.html",
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
