import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-bf6FjIJ7d84yoaSwGqrkDGG3",
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function getShelfLifeFromChatGPT(ingredientName: string){
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: "Combien de temps se conserve un" + ingredientName + "?"
            }
        ]
    });
    console.log(response);

    return response.data.choices[0].message.content;
}