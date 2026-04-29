# Quiz Content Examples

These examples show how quiz questions are currently filtered and how to make that behaviour explicit.

## Example 1: Image-based multiple-choice questions are omitted

**Request**

```http
GET /api/v0/lessons/some-lesson/questions
```

**Current response (observed)**

- Questions that contain image-based answers are omitted when images are not allowed for the subject/unit.
- The response does not indicate that any questions were removed.

**Desired response metadata**

```json
{
  "imagesAllowed": false,
  "questionsOmitted": 2,
  "omittedReason": "image_answers_not_permitted",
  "starterQuiz": [ /* questions */ ],
  "exitQuiz": [ /* questions */ ]
}
```

**Related maths-specific enhancements:** `21-maths-education-enhancements.md` items 3 and 4 (structured maths answers and image-based quiz items).
