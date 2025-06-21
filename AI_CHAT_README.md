# AI Chat - Mark3

## Description

The AI Chat page is an integrated functionality in Mark3 that allows users to interact with an AI assistant specialized in trademarks, blockchain, and the Mark3 platform.

## Features

- 🤖 **Specialized AI Assistant**: Contextual responses about trademarks and blockchain
- 💬 **Real-time Chat**: Modern and responsive chat interface
- 🔄 **Conversation History**: Maintains conversation context
- 📱 **Responsive Design**: Works perfectly on mobile and desktop devices
- 🎨 **Modern UI**: Design consistent with the rest of the Mark3 application

## Configuration

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Generate a new API key
4. Copy the API key

### 2. Configure Environment Variables

1. Create a `.env.local` file in the project root
2. Add your OpenAI API key:

```bash
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
npm install openai
```

## Usage

### For Users

1. Navigate to the AI Chat page from the main menu
2. Type your question in the text field
3. Press Enter or click "Send"
4. The assistant will respond with relevant information

### Supported Question Types

- **Trademarks**: Information about registration, protection, and intellectual property
- **Blockchain**: Explanations about blockchain technology and its application
- **Mark3**: Queries about the platform and its services
- **Legal Advice**: Basic information about trademark protection

### For Developers

#### File Structure

```
src/
├── pages/
│   ├── ai-chat.tsx          # Main chat page
│   └── api/
│       └── chat.ts          # API endpoint for OpenAI
```

#### Main Components

- **AIChatPage**: Main page component
- **Message Interface**: Defines message structure
- **API Endpoint**: Handles OpenAI requests

#### Customization

You can customize the assistant's behavior by modifying the system prompt in `src/pages/api/chat.ts`:

```typescript
{
  role: 'system',
  content: `Your custom prompt here...`
}
```

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-3.5-turbo
- **State**: React Hooks (useState, useEffect, useRef)

## Security

- API keys are handled securely in environment variables
- Conversations are not stored in the database
- Responses are generated in real-time

## Limitations

- Requires internet connection
- Depends on OpenAI API availability
- Responses are informative and do not constitute professional legal advice

## Troubleshooting

### Error: "OpenAI API key not configured"
- Verify that the `.env.local` file exists
- Make sure `NEXT_PUBLIC_OPENAI_API_KEY` is correctly configured
- Restart the development server

### Error: "Server response error"
- Check your internet connection
- Verify that your OpenAI API key is valid
- Check server logs for more details

### Chat not responding
- Verify that the server is running
- Check the browser console for errors
- Make sure the `/api/chat` endpoint is working

## Contributing

To contribute to the AI Chat functionality:

1. Fork the repository
2. Create a branch for your feature
3. Implement your changes
4. Test the functionality
5. Submit a pull request

## License

This project is under the same license as Mark3. 