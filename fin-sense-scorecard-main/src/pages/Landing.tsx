import React, { useState } from 'react';
import { FaChartLine, FaFileAlt, FaBell, FaLightbulb, FaLock, FaCalculator, FaCheck, FaStar, FaUniversity, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaChevronDown, FaChevronUp, FaBars, FaTimes } from 'react-icons/fa';
import { Button } from "@/components/ui/button";

interface LandingProps {
  onGetStarted: () => void;
}

const Landing = ({ onGetStarted }: LandingProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <FaChartLine className="w-12 h-12 text-navy mb-4" />,
      title: "Credit Score Tracking",
      description: "Monitor your credit score in real-time with updates from all major credit bureaus in Zimbabwe."
    },
    {
      icon: <FaFileAlt className="w-12 h-12 text-navy mb-4" />,
      title: "Full Credit Report Access", 
      description: "Get comprehensive credit reports from all three major bureaus - Experian, Equifax, and TransUnion."
    },
    {
      icon: <FaBell className="w-12 h-12 text-navy mb-4" />,
      title: "Real-time Alerts",
      description: "Get instant notifications about changes to your credit score and potential fraud attempts."
    },
    {
      icon: <FaLightbulb className="w-12 h-12 text-navy mb-4" />,
      title: "Personalized Tips",
      description: "Get customized recommendations to improve your credit score based on your unique profile."
    },
    {
      icon: <FaLock className="w-12 h-12 text-navy mb-4" />,
      title: "Identity Theft Protection",
      description: "Advanced monitoring and protection against identity theft and fraudulent activities."
    },
    {
      icon: <FaCalculator className="w-12 h-12 text-navy mb-4" />,
      title: "Score Simulators",
      description: "See how different financial decisions could impact your credit score before you make them."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Account",
      description: "Sign up in seconds with just your email and basic information."
    },
    {
      number: "2", 
      title: "Secure Verification",
      description: "Verify your identity through our bank-level security protocols."
    },
    {
      number: "3",
      title: "Link Your Bank",
      description: "Securely connect your Zimbabwean bank account to access your credit data."
    },
    {
      number: "4",
      title: "Start Tracking",
      description: "Begin monitoring, improving, and protecting your credit score immediately."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mukamuri",
      text: "Scorly helped me improve my credit score by 150 points in just 6 months!",
      rating: 5
    },
    {
      name: "David Chikwanha",
      text: "The real-time alerts saved me from identity theft. Highly recommended!",
      rating: 5
    },
    {
      name: "Grace Mutamba",
      text: "Finally, a credit monitoring service that works with Zimbabwean banks.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Will checking my score affect it?",
      answer: "No, checking your credit score through Scorly is a 'soft inquiry' that does not impact your credit score. You can check it as often as you like without any negative effects."
    },
    {
      question: "Is it really free?",
      answer: "Yes! Our basic credit monitoring service is completely free. We offer premium features for a small monthly fee, but you can access your credit score and basic monitoring at no cost."
    },
    {
      question: "Where does your data come from?",
      answer: "We partner with major credit bureaus and financial institutions in Zimbabwe to provide you with accurate, up-to-date credit information directly from the source."
    },
    {
      question: "How secure is my data?",
      answer: "We use bank-level 256-bit SSL encryption to protect your data. Your information is never sold to third parties and is stored using the same security standards as major financial institutions."
    },
    {
      question: "Which banks do you support?",
      answer: "We support all major Zimbabwean banks including CBZ, Stanbic, Standard Chartered, FBC, and many others. You can see the full list during signup."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-navy font-sacrifice">Scorly</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-navy transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <Button 
                onClick={onGetStarted}
                className="bg-navy hover:bg-navy-dark text-white"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-navy"
              >
                {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-600 hover:text-navy transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="px-3 py-2">
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onGetStarted();
                    }}
                    className="w-full bg-navy hover:bg-navy-dark text-white"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-navy-light text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-sacrifice">Scorly</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Track, Improve, and Protect Your Credit Score for Free
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            The first comprehensive credit monitoring platform designed specifically for Zimbabwe. 
            Monitor your credit health across all major local banks and financial institutions.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-navy hover:bg-gray-100 text-lg px-8 py-4"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Manage Your Credit</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and insights to help you understand and improve your financial health
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm text-center">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in just four simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of Zimbabweans who trust Scorly</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bank-Level Security & Trust</h2>
            <p className="text-xl text-gray-600">Your data is protected with the highest security standards</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaLock className="w-12 h-12 text-navy mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">256-bit SSL Encryption</h3>
              <p className="text-gray-600">All data is encrypted using industry-standard protocols.</p>
            </div>
            <div className="text-center">
              <FaLock className="w-12 h-12 text-navy mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Identity Protection</h3>
              <p className="text-gray-600">Advanced monitoring and fraud detection systems.</p>
            </div>
            <div className="text-center">
              <FaUniversity className="w-12 h-12 text-navy mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted Partners</h3>
              <p className="text-gray-600">We work directly with major Zimbabwean financial institutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions about Scorly</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full bg-white p-6 rounded-lg shadow-sm text-left flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  {openFaq === index ? (
                    <FaChevronUp className="text-navy" />
                  ) : (
                    <FaChevronDown className="text-navy" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="bg-white px-6 pb-6 rounded-b-lg shadow-sm">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control of Your Credit?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join over 10,000+ Zimbabweans who trust Scorly to monitor and improve their credit health
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-navy hover:bg-gray-100 text-lg px-8 py-4"
          >
            Check My Score Free
          </Button>
          <p className="mt-4 text-navy-light">Trusted by 10,000+ users • 100% Free to start</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-sacrifice">Scorly</h3>
              <p className="text-gray-400">Your trusted credit health partner in Zimbabwe</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <FaFacebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                <FaTwitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                <FaLinkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                <FaInstagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              </div>
              <p className="text-gray-400 mt-4">contact@scorly.co.zw</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Scorly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
