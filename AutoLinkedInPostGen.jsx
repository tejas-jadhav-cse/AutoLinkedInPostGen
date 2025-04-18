import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const fetchTopTopic = async () => {
  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const ids = await res.json();
  const topicRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${ids[0]}.json`);
  const topicData = await topicRes.json();
  return topicData.title;
};

export default function AutoLinkedInPostGen() {
  const [topic, setTopic] = useState("");
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const generatePost = async () => {
    setLoading(true);
    const fetchedTopic = topic || (await fetchTopTopic());
    setTopic(fetchedTopic);

    const prompt = `Write a short LinkedIn post in a casual and engaging tone about the topic: "${fetchedTopic}". Emphasize why it matters to developers.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    setPost(content);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">🔁 Auto LinkedIn Post Generator</h1>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <Input
            placeholder="Enter your OpenAI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <Input
            placeholder="(Optional) Enter your own topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <Button onClick={generatePost} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Generate Post"}
          </Button>

          <Textarea
            rows={8}
            value={post}
            readOnly
            placeholder="Your generated LinkedIn post will appear here..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
