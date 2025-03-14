const calculateRewards = (amount, category, cardType) => {
    let rewardPoints = 0;
  
    //  Category-Based Rewards
    const categoryRewards = {
      "Dining": 5,        // 5 points per ₹100
      "Groceries": 3,
      "Online Shopping": 2,
      "Others": 1,
    };
  
    rewardPoints += (categoryRewards[category] || 1) * (amount / 100);
  
    //  Card Type-Based Multipliers
    const cardMultipliers = {
      "Gold": 2,
      "Platinum": 3,
      "Silver": 1,
    };
  
    rewardPoints *= cardMultipliers[cardType] || 1;
  
    //  Spending Threshold Bonus
    if (amount > 5000) rewardPoints += 50;
    if (amount > 10000) rewardPoints += 100;
  
    return Math.floor(rewardPoints); // Round off points
  };
  
  module.exports = calculateRewards;
  