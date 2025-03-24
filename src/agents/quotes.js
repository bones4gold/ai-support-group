 const quotes = [
    "“We are not a glum lot. We absolutely insist on enjoying life.” — AA Big Book, p. 132",
    "“No matter how far down the scale we have gone, we will see how our experience can benefit others.” — AA Big Book, p. 84",
    "“We are people who normally would not mix. But there exists among us a fellowship, a friendliness, and an understanding.” — AA Big Book, p. 17",
    "“Acceptance is the answer to all my problems today.” — AA Big Book, p. 417",
    "“When I stopped living in the problem and began living in the answer, the problem went away.” — AA Big Book, p. 417",
    "“Nothing, absolutely nothing, happens in God’s world by mistake.” — AA Big Book, p. 417",
    "“We are sure God wants us to be happy, joyous, and free.” — AA Big Book, p. 133",
    "“Selfishness—self-centeredness! That, we think, is the root of our troubles.” — AA Big Book, p. 62",
    "“We stood at the turning point.” — AA Big Book, p. 59",
    "“We asked His protection and care with complete abandon.” — AA Big Book, p. 59",
    "“Faith without works is dead.” — AA Big Book, p. 88",
    "“We will intuitively know how to handle situations which used to baffle us.” — AA Big Book, p. 84",
    "“We will not regret the past nor wish to shut the door on it.” — AA Big Book, p. 83",
    "“Fear is the evil and corroding thread; the fabric of our lives was shot through with it.” — AA Big Book, p. 67",
    "“The spiritual life is not a theory. We have to live it.” — AA Big Book, p. 83",
    "“We alcoholics are undisciplined. So we let God discipline us.” — AA Big Book, p. 88",
    "“It is plain that a life which includes deep resentment leads only to futility and unhappiness.” — AA Big Book, p. 66",
    "“There is a solution.” — AA Big Book, p. 25",
    "“We are not saints. The point is, that we are willing to grow along spiritual lines.” — AA Big Book, p. 60",
    "“We claim spiritual progress rather than spiritual perfection.” — AA Big Book, p. 60",
    "“We don’t recover overnight.” — AA Big Book, p. 135",
    "“Resentment is the number one offender.” — AA Big Book, p. 64",
    "“We do not tire so easily, for we are not burning up energy foolishly as we did when we were trying to arrange life to suit ourselves.” — AA Big Book, p. 88",
    "“The feeling of having shared in a common peril is one element in the powerful cement which binds us.” — AA Big Book, p. 17",
    "“If we are painstaking about this phase of our development, we will be amazed before we are halfway through.” — AA Big Book, p. 83",
    "“We alcoholics are men and women who have lost the ability to control our drinking.” — AA Big Book, p. 30",
    "“The first requirement is that we be convinced that any life run on self-will can hardly be a success.” — AA Big Book, p. 60",
    "“The great fact is just this, and nothing less: That we have had deep and effective spiritual experiences.” — AA Big Book, p. 25",
    "“We are like men who have lost their legs; they never grow new ones.” — AA Big Book, p. 30",
    "“We let God discipline us in the simple way we have just outlined.” — AA Big Book, p. 88",
    "“We found that God does not make too hard terms with those who seek Him.” — AA Big Book, p. 46",
    "“We think cheerfulness and laughter make for usefulness.” — AA Big Book, p. 132",
    "“We never apologize to anyone for depending upon our Creator.” — AA Big Book, p. 68",
    "“Our real purpose is to fit ourselves to be of maximum service to God and the people about us.” — AA Big Book, p. 77",
    "“The more we become willing to depend upon a Higher Power, the more independent we actually are.” — AA Big Book, p. 36",
    "“We avoid retaliation or argument. We wouldn’t treat sick people that way.” — AA Big Book, p. 67",
    "“We are building an arch through which we shall walk a free man at last.” — AA Big Book, p. 75",
    "“We have ceased fighting anything or anyone—even alcohol.” — AA Big Book, p. 84"
];
  
  export function getRandomQuote() {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  }
  
