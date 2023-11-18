
// OpenAI gpt request, without the image data

export interface VisionRequest {
    system: string
    header: string
    footer: string
    max_tokens: number
}