"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RulesFAQsPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [toggle, setToggle] = useState(true);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "How are piece-value points calculated?",
      answer:
        "Piece-value points are calculated based on the remaining pieces at the end of the game. Each piece has a specific point value: Queen = 9 pts, Rook = 5 pts, Bishop/Knight = 3 pts each, Pawn = 1 pt.",
    },
    {
      question: "Do I get piece points if I lose?",
      answer:
        "Yes, you still earn piece-value points based on your remaining pieces even if you lose the game. These points serve as secondary tiebreakers.",
    },
    {
      question: "What if internet fails mid-game?",
      answer:
        "If internet connection fails during a game, please contact the tournament administrators immediately. Each case will be reviewed individually and appropriate action will be taken.",
    },
    {
      question: "Can I see my points in real-time?",
      answer:
        "Yes, you can view your current standings and points in real-time through the tournament dashboard during active competition periods.",
    },
    {
      question: "What if I checkmate but have no pieces left?",
      answer:
        "If you achieve checkmate, you win the game and receive the full 3 league points plus any piece-value points for your remaining pieces, even if minimal.",
    },
  ];

  return (
    <div className='min-h-screen bg-[#1C1C1E] text-white'>
      {/* Navigation Tabs */}
      <div className='border-b border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex space-x-8'>
            <button
              onClick={() => setToggle(true)}
              className={`border-b-2  ${
                toggle
                  ? "border-yellow-400 text-yellow-400"
                  : "hover:text-gray-400 "
              }  py-4 px-1 text-sm font-medium `}
            >
              Rules & FAQs
            </button>
            <button
              onClick={() => setToggle(false)}
              className={`border-b-2 border-transparent ${
                !toggle
                  ? "border-yellow-400 text-yellow-400"
                  : "hover:text-gray-400 "
              } py-4 px-1 text-sm font-medium  `}
            >
              Anti-Cheating Kits
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Rules Section */}
          {toggle ? (
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold mb-2'>Rules</h1>
                <Button
                  variant='link'
                  className='text-white p-0 h-auto font-normal underline'
                >
                  Official Tournament Rules Download PDF
                </Button>
              </div>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold mb-3'>Key Sections:</h3>

                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-medium mb-2'>
                        • League Points (Primary):
                      </h4>
                      <div className='ml-6 space-y-1 text-sm'>
                        <p>◦ Win = 3 pts | Draw = 1 pt | Loss = 0 pts.</p>
                      </div>
                    </div>

                    <div>
                      <h4 className='font-medium mb-2'>
                        • Piece Value Points (Secondary):
                      </h4>
                      <div className='ml-6 space-y-1 text-sm'>
                        <p>
                          ◦ Earn extra points based on remaining pieces at game
                          end.
                        </p>
                        <p>◦ Queen = 9 pts</p>
                        <p>◦ Rook = 5 pts</p>
                        <p>◦ Bishop/Knight = 3 pt</p>
                        <p>◦ Pawn = 1 pt</p>
                      </div>
                    </div>

                    <div>
                      <h4 className='font-medium mb-2'>• Examples:</h4>
                      <div className='ml-6 space-y-1 text-sm'>
                        <p>◦ Winning/Drawing with a queen = 2 pawns + 11</p>
                        <p>win pts (or 1 pt) = 1 (pawns) + 2 (queen) pts.</p>
                      </div>
                    </div>

                    <div>
                      <h4 className='font-medium mb-2'>• Tiebreakers:</h4>
                      <div className='ml-6 space-y-1 text-sm'>
                        <p>a. Head-to-head results.</p>
                        <p>b. Total piece-value points.</p>
                        <p>c. Fewest disqualifications.</p>
                      </div>
                    </div>

                    <div>
                      <h4 className='font-medium mb-2'>• Disqualifications:</h4>
                      <div className='ml-6 space-y-1 text-sm'>
                        <p>a. Cheating (engine use, impersonation).</p>
                        <p>b. Harassment (verbal/written).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold mb-2'>Anti-Cheating Kits</h1>
                <Button
                  variant='link'
                  className='text-white p-0 h-auto font-normal underline'
                >
                  Official Anti-Cheating Kit Download PDF
                </Button>
              </div>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold mb-3'>Webcam Setup</h3>

                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-medium mb-2'>
                        • Step-by-Step Guide(Primary):
                      </h4>
                      <div className='ml-6 space-y-1 text-sm'>
                        <p>◦ "Position your phone here →" (images)</p>
                        <p>◦ Test tool: Webcam Checker</p>
                      </div>
                    </div>

                    <div>
                      <h3 className='font-semibold mb-2'>
                        Report Suspicious Play
                      </h3>
                      <h4 className='font-medium '>
                        • In-game: Click  "Report Move" (flags to admins)
                      </h4>
                      <h4 className='font-medium mb-2'>
                        • Post-game: Email fairplay@naijachess.com with:
                      </h4>
                      <div className='ml-6 space-y-1 text-sm'>
                        <p>• Game ID</p>
                        <p>
                          • Suspicious move (e.g., "Move 23: Qh5!! (99% engine
                          match)")
                        </p>
                      </div>
                    </div>

                    <div>
                      {" "}
                      <h3 className='font-semibold mb-2'>Fair Play Pledge</h3>
                      <div className='ml-6 space-y-1 text-sm'>
                        <p>
                          • "I play like a true Omo Naija – no
                          engines!" (Players must check ☑️)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQs Section */}
          <div className='space-y-6'>
            <h1 className='text-3xl font-bold'>FAQs</h1>

            <div className='space-y-4'>
              {faqs.map((faq, index) => (
                <div key={index} className='border-b border-gray-700 pb-4'>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className='flex justify-between items-center w-full text-left py-2 hover:text-yellow-400 transition-colors'
                  >
                    <span className='text-sm font-medium'>{faq.question}</span>
                    {openFAQ === index ? (
                      <ChevronUp className='h-4 w-4 flex-shrink-0 ml-2' />
                    ) : (
                      <ChevronDown className='h-4 w-4 flex-shrink-0 ml-2' />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className='mt-2 text-sm text-gray-300 leading-relaxed'>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className='mt-8 pt-6 border-t border-gray-700'>
              <p className='text-sm text-gray-400'>
                For more question, text FAQs to 0811-123-1233 or mail{" "}
                <span className='text-white'>info@kingsqueens.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
