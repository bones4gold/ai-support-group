const quotes = [
    "“We are not a glum lot. We absolutely insist on enjoying life.” — AA Big Book, p. 132",
    "“No matter how far down the scale we have gone, we will see how our experience can benefit others.” — AA Big Book, p. 84",
    "“We are people who normally would not mix. But there exists among us a fellowship, a friendliness, and an understanding.” — AA Big Book, p. 17",
    "“Acceptance is the answer to all my problems today.” — AA Big Book, p. 417",
    "“When I stopped living in the problem and began living in the answer, the problem went away.” — AA Big Book, p. 417"
  ];
  
  export function getRandomQuote() {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  }
  