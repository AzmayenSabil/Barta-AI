# Bangla Speech-to-Text Pipeline with Meeting Analysis

This architecture outlines a comprehensive solution for processing Bangla audio files and extracting meaningful information from meeting transcriptions.

## 1. Audio Upload & Validation Layer
- **Audio Upload**: Users upload audio files (e.g., MP3, WAV, M4A).
- **Audio Validation**: 
  - Validates the uploaded file for size, format, and quality (bitrate, sample rate, channels).
- **Audio Quality Check**: Ensures the uploaded audio meets the necessary standards for processing.

## 2. Audio Preprocessing Pipeline
- **Audio Segmentation**: 
  - Splits long recordings into smaller, manageable segments (15-30 seconds).
  - Removes silent periods.
- **Noise Reduction**: 
  - Applies adaptive noise reduction techniques to improve audio quality.
- **Speech Enhancement**: 
  - Uses spectral subtraction to reduce background noise.
- **Format Conversion**: 
  - Converts the audio to a standard 16kHz mono WAV format (if necessary).

## 3. ASR (Automatic Speech Recognition)
- **Primary ASR Model**: 
  - **Option 1**: Fine-tune the Whisper model on Bangla data.
  - **Option 2**: Use a custom ASR model (e.g., Wav2Vec 2.0 or Conformer) trained on Bangla speech.
  - **Option 3**: Google Speech To Text (Free Trial).
- **Speaker Diarization**: 
  - Segments the audio by speaker and labels the transcribed text accordingly.

## 4. Post-processing Pipeline
- **Text Normalization**: 
  - Handles special characters, numbers, and ASR errors.
- **Language Model Correction**: 
  - Implements a Bangla-specific language model to handle domain-specific terms and grammatical errors.

## 5. Analysis Layer
- **Text Summarization**: 
  - Extracts key discussion points and generates concise summaries.
- **Action Items Detection**: 
  - Identifies tasks, deadlines, and responsibilities from the transcript.
- **Speaker Attribution**: 
  - Matches each part of the transcript to the respective speaker.

## 6. Storage & Database Design
### Database
Stores processed data including:
- **Meetings**: Information about each meeting (e.g., ID, duration, status).
- **Transcripts**: Full transcriptions, including their processed status.
- **Speakers**: Speaker labels and corresponding speaking segments.
- **Action Items**: Tasks identified during the meeting, with assignee and due date.

### Example SQL Schema

```sql
-- Core Tables

meetings
  - meeting_id
  - date_time
  - duration
  - audio_file_path
  - status

transcripts
  - transcript_id
  - meeting_id
  - full_text
  - processed_status

speakers
  - speaker_id
  - meeting_id
  - speaker_label
  - speaking_segments

action_items
  - item_id
  - transcript_id
  - description
  - assignee
  - due_date
```

## Mermaid Live Editor
[Link](https://mermaid.live/edit#pako:eNqNV21v4jgQ_itWpO0nQAVR6PHhJNpSjtty5Qi7J13YDyZxg9XERn7pllb97zd2XnBe6B5STOx5nMw8M56ZvHshj4g38WKBD3u0udsyBL8vX9C94EwRFiFf7-RRKpJmIql3GXbrlZAuWhMcqq2XQczv2yKwa3Dz47S6JpF-DeyIfIUVQUvMcExSwpQL41pRFudPMDMi4CW3CQVc16cRKSDOpqlW-8AMgKEhVpQzdGFXuaBv2XzJI50QZ9M3RRMZmJGqI_KJeKEhkR1EenGvg-65SLGCl8PKd5zQCCsupLP9lqcHzuCFEnTVEu8S4qyhB7oTWBzd9y1Qt_t7xkNzNbOpsW5saCxazds0yaSLTATe2bLSpzc4fP7cpQWii-6xVNPVwvUpTIN8Ga1n_sbyRUTNBzmJ1hUFoy4DkogCYu6dCGhBLwkxlBQb8unne6Y6ovykBUzQH5hFidnYgmY4OUoqiw0b8qrKxRb8BsvnEgv3aColjdkZXf6eFtgbzOIEwwIE5Xo6RxvOk5YNf3FFn4o9dlLE8glb8UgZIbm8KXQYbwqrBLc9-URmi7RKXhPgsNUUluQ0RS4NrsFOqGaeXQkOB1Ya367ogYCTiRuy5rcSJIDrcEI2abfv9tfBrZaKp5AuzEmGhTPQFZcqMMMvH9pQJePNXzfebQXmmSeJc3rrxhcBes7oO4pF4B8IfoYjZiZFCmxX09dpFvlwk_4KbJz6P2Lfxr8m0jzJCf92IBwJSKFKUPKCk-5Ux-ahJEJzwojIlDEn5nN2gTzLorG3SYcVgX0Ny8tIbZcUNrRblmXu6bzmtWbyvcMK77Ak6AEfiWhk3prYceeSs5gHdry7gcy8xJSVT6sWV2rqEIzoFod7CDX0lRy7ULk0gXLLhYue-cEsgWROQ0mwCPcAzgIgm11kZ9uIf5yJwUKjW54kJDRcyHoU5tlFFolbOuB6UAnMZCjoAWqpc39-wzR7ZZD9owWUs0_QeVwTGZR37eDambNGuplStskchdvEuaptolKbtpCBop5qdmpmZq_Qi4BbykalEUVNhOORWYppEtixkOeNjr_crBwO_KUfwIXm0KH9xMcctPkJXRJ3YCst94EZ0JlC1WYRY8Rlo2hxVnnDUtYlw1B1yUZ2dWnm1-bGtuoS2FFdMAo7GjU6Rp-EWkA32OA2a2jK1skh9tH2nnZEg96lKUov0KSKnLg553FCOmj6pitH8M9_NgFckNig50ILKTVm4JKLotesBqZv6gxk0vzf7YGgNeb8GYLI5bzWj1nbH0-tZF0EirQL8vc5lD3wODYV78J4iUJeKZvWanbIRYB73EEP8oJ3ts12mQOmUgIO0DI43ZocZ0pBeOaIzgV-AuOD_N-Bf6fAYZJXLzfZPXwN4DLfHOGzoQtYEwYIFSa3pkFdES6lWtm6qyaIcx1qYfjwdcu8jpcS-H6gEXxevRvA1oN9KZTqCdxG5AnrxH4zfQAUa8X9Iwu9iRKadDzBdbz3Jk84kTDTBwgHAkUM2E0LyAGzfzl3p97k3Xv1Jt1BvzcejYb94Qh-w8vBb8OOd_QmV8Pe1dXgsn89vhqPR-Pr64-O92afMOj1R5f9QX9wORiOrq_Hg4__ALLOSio)
