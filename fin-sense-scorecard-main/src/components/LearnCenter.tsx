
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const LearnCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const articles = [
    {
      title: "Understanding Your Credit Score",
      category: "Basics",
      readTime: "5 min read",
      difficulty: "Beginner",
      description: "Learn what factors affect your credit score and how it's calculated."
    },
    {
      title: "How to Improve Your Credit Utilization",
      category: "Improvement",
      readTime: "7 min read",
      difficulty: "Beginner",
      description: "Strategies to optimize your credit card usage for better scores."
    },
    {
      title: "The Impact of Payment History",
      category: "Basics",
      readTime: "6 min read",
      difficulty: "Beginner",
      description: "Why payment history is the most important factor in your credit score."
    },
    {
      title: "Building Credit from Scratch",
      category: "Building",
      readTime: "10 min read",
      difficulty: "Beginner",
      description: "A complete guide for young adults starting their credit journey."
    },
    {
      title: "Credit Card vs. Debit Card: What's the Difference?",
      category: "Basics",
      readTime: "4 min read",
      difficulty: "Beginner",
      description: "Understanding the key differences and when to use each."
    },
    {
      title: "Advanced Credit Strategies",
      category: "Advanced",
      readTime: "15 min read",
      difficulty: "Advanced",
      description: "Sophisticated techniques for credit optimization and planning."
    }
  ];

  const faqs = [
    {
      question: "What is a good credit score?",
      answer: "A good credit score typically ranges from 670 to 739. Scores above 740 are considered very good to excellent."
    },
    {
      question: "How often should I check my credit score?",
      answer: "It's recommended to check your credit score at least once a month to monitor changes and catch any issues early."
    },
    {
      question: "Does checking my credit score hurt my credit?",
      answer: "No, checking your own credit score is a 'soft inquiry' and doesn't affect your credit score."
    },
    {
      question: "How long does it take to improve my credit score?",
      answer: "It typically takes 3-6 months to see significant improvements, but some changes can be seen in as little as 30 days."
    }
  ];

  const creditTerms = [
    { term: "APR", definition: "Annual Percentage Rate - the yearly cost of borrowing money" },
    { term: "Credit Utilization", definition: "The percentage of available credit you're using" },
    { term: "Hard Inquiry", definition: "A credit check that may temporarily lower your credit score" },
    { term: "Soft Inquiry", definition: "A credit check that doesn't affect your credit score" },
    { term: "Credit Mix", definition: "The variety of credit types in your credit portfolio" },
    { term: "Payment History", definition: "Your track record of making payments on time" }
  ];

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return <Badge className="bg-green-100 text-green-800">Beginner</Badge>;
      case "Intermediate":
        return <Badge className="bg-yellow-100 text-yellow-800">Intermediate</Badge>;
      case "Advanced":
        return <Badge className="bg-red-100 text-red-800">Advanced</Badge>;
      default:
        return <Badge variant="secondary">{difficulty}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Basics":
        return <Badge variant="outline">Basics</Badge>;
      case "Improvement":
        return <Badge className="bg-blue-100 text-blue-800">Improvement</Badge>;
      case "Building":
        return <Badge className="bg-purple-100 text-purple-800">Building</Badge>;
      case "Advanced":
        return <Badge className="bg-gray-100 text-gray-800">Advanced</Badge>;
      default:
        return <Badge variant="secondary">{category}</Badge>;
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Learn Center</h2>
        <Button variant="outline">
          Suggest Topic
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Articles</CardTitle>
          <CardDescription>Find answers to your credit questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search articles, topics, or questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Featured Articles</CardTitle>
            <CardDescription>Popular credit education content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredArticles.map((article, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{article.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{article.description}</p>
                      <div className="flex items-center space-x-2">
                        {getCategoryBadge(article.category)}
                        {getDifficultyBadge(article.difficulty)}
                        <span className="text-xs text-gray-500">{article.readTime}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Read
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All FAQs
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credit Terms Glossary</CardTitle>
          <CardDescription>Essential credit terminology explained</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creditTerms.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold text-navy mb-2">{item.term}</h4>
                <p className="text-sm text-gray-600">{item.definition}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Full Glossary
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Video Tutorials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl mb-2">🎥</div>
              <p className="text-sm text-gray-600 mb-4">
                Watch step-by-step guides and expert explanations
              </p>
              <Button variant="outline" className="w-full">
                Browse Videos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calculators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl mb-2">🧮</div>
              <p className="text-sm text-gray-600 mb-4">
                Use our tools to plan your credit improvement journey
              </p>
              <Button variant="outline" className="w-full">
                Access Tools
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expert Advice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl mb-2">💡</div>
              <p className="text-sm text-gray-600 mb-4">
                Get personalized advice from credit experts
              </p>
              <Button variant="outline" className="w-full">
                Book Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearnCenter;
