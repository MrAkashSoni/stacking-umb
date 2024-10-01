export const en = {
  faq: {
    searchPlaceholder: "Search FAQs",
    items: {
      allowance: {
        title: "What is an allowance and why do we need it?",
        body: "An allowance is the maximum amount of tokens our staking contract is allowed to ‘spend’ on your behalf. We need an allowance that you are comfortable with so that you can stake on our site. If you do not have an allowance, then you will not be able to stake.",
      },
      trust: {
        title: "What is Trust This Contract Forever?",
        body: "Trust this contract forever gives the Staking Contract a high amount of tokens (allowance) to spend while staking so that you do not have to re-approve a maximum amount to stake. If you select 'Trust this contract forever', it will make sure you no longer need to put an allowance each time you stake Tokens.",
      },
      process: {
        title:
          "I'm in the process of staking. I already approved the first fee (allowance) but I don't want to approve the staking fee as the gas is through the roof. Will I use the first fee if I cancel now?",
        body: "If the first transaction for staking was already approved by etherscan, then you can stake at any time.",
        body2:
          "If you have approved the transaction to go through and have not gotten to the point of confirming the transaction, then the contract cannot charge more than the allowance specified. The value approved will remain approved. In this case, you'll be able to stake a value equal or less than the approved one. If you want to stake a higher amount, you will need to approve once again.",
      },
      liquidity: {
        title: "How do I add liquidity to a Pool on Uniswap V2?",
        rawText:
          "Adding liquidity to a pool is a required step to participate on LP-related Umbrella STREAMS. In order to add liquidity to the ETH-UMB Pool on Uniswap V2, you should access this Uniswap link and follow the steps described below. *Please note: Currently, our Polar STREAM only accepts Uniswap V2 LP Tokens. If you have issues using the link above and finding Uniswap V2 see our step by step below. Otherwise, you can skip to Step 4 - Set the amounts you want to supply. Please go to: https://app.uniswap.org/#/pools to begin providing liquidity. The first thing to do after landing on Uniswap portal is to scroll to the View V2 Liquidity button and click on it. After clicking on the View V2 Liquidity button, you will be able to see your V2 Liquidity. You can click on the Add V2 Liquidity button to enter a pool. You are now on the Uniswap V2 Add Liquidity page and are able to begin the process of providing liquidity to the ETH-UMB pair on Uniswap. In order to do so, please continue with the steps listed on the section below. The first thing to do after landing on Uniswap portal is to input the amounts you want to supply to the corresponding pool. You can also check prices and the Share of Pool your Supply represents. After making sure you filled the inputs with the desired values, click the button Supply. You will have a chance to check the amounts once again after this. After clicking on the Supply button, you will be prompted with a card containing the amount of UMB/ETH Pool Tokens you will receive as well as the amounts of UMB and ETH to deposit, rates and Share of Pool. After checking everything you should click on the Confirm Supply button, and proceed to the next step. After clicking on the Confirm Supply button, you will be asked to confirm the transaction on MetaMask or any wallet supported by Uniswap you might be using. Once you do this, you should see the card shown below. Just as it says on it, the transaction was submitted and you should now wait for it to be minted. You can also take the opportunity to click on the Add UNI-V2 to Metamask button and quickly add this custom token to your wallet assets tab. Once the transaction is minted, you will be able to verify your liquidity data by clicking on Pools tab, on Uniswap portal. You are now a liquidity provider on Uniswap UMB-ETH Pool! You can now head over to the Stake tab on our portal and stake tokens on the STREAM related to the pool you are participating. You can also find instructions on how to stake on our FAQ here.",
      },
      tutorial: {
        title: "How to stake Tokens?",
        rawText:
          "If you are planning on staking on LP-related STREAMS, please visit this section to learn how to add liquidity to an Uniswap pool before proceeding with How to Stake Tokens. Navigate to https://staking.umb.network and click on the 'Connect Wallet' button. Ensure that you have Metamask installed on your browser, Android device, or your iOS device, as the case may be. Once successfully connected, enter the number of Tokens you want to stake from your balance and click on the 'Stake' button to get started. For a step-by-step guide, see below: Connect to your MetaMask wallet using the CONNECT WALLET button. You can stake your Umbrella Tokens to farm more Umbrella Tokens over time. The staking form can be found at the STAKE tab in the main page. You can set all of your balance for staking by clicking the 'MAX' button located right next to the input. Before staking, you have to set an amount of Umbrella Tokens for Allowance. The amount of Tokens set for Allowance won't be removed from your balance. This means that two contract operations will be called upon clicking the 'STAKE' button: Allowance and Staking. If you want to skip the Allowance step, check the option labeled 'TRUST CONTRACT FOREVER'. By doing so, you'll only have to go through the Allowance step once. Otherwise, the same amount of UMB will be set for Allowance and Staking, meaning two transactions will be needed in order to stake tokens. Withdraw your staked Tokens by going to the Withdraw form. The withdraw form can be found at the WITHDRAW tab in the main page. After setting how many Tokens you want to withdraw, click the WITHDRAW button to call a contract transaction. You can also set all of your Tokens for withdraw by clicking the 'MAX' button displayed above. Withdraw all of your staked Tokens while claiming all of your rewards in a single transaction by clicking the button labeled 'CLAIM REWARDS & WITHDRAW ALL'. Check your Token balances and rewards at the 'YOUR WALLET' card in the main page. Claim Umbrella Tokens received as rewards by clicking the 'CLAIM REWARDS' button.",
      },
      transactions: {
        title:
          "I can connect my wallet. Why aren't my balances or transactions loading?",
        body: "There are a few reasons why you might not be seeing your balances or transactions.",
        item1: "1. Your MetaMask or browser might not be up-to-date.",
        item2: "2. Your transactions might still be processing.",
        item3:
          "3. If you are still unable to view transactions or balances, there may be an internal issue with MetaMask.",
        item3cont: "Please visit their support sites by clicking <1>here</1>.",
        item4:
          "4. You might have an ad blocker or antivirus blocking the connection between your browser and Metamask, be sure to turn them off and try again.",
        body2: "Our website can only fetch what the wallet is telling it.",
      },
      can: {
        title: "What can we stake?",
        body: "Depending on the protocol, you can stake the native token of that particular protocol on that token's staking platform.",
        body2:
          "For example, you can only stake Tokens on the Umbrella Network's staking platform.",
      },
      lockin: {
        title: "Is there a lock-in period?",
        body: "There is no lock-in period for your earned UMB tokens. You can withdraw and claim your UMB anytime.",
      },
      safe: {
        title:
          "When Umbrella implements DPoS consensus, will my staking be penalized if the validator incorrectly votes on consensus?",
        body: "Staking on the Umbrella Network has an ultimate design to be done via a DPoS consensus mechanism. This means that the elected validator shall create the block for the transactions to be validated and get the result validated by the other validators before commitment to the Blockchain as a hash.",
        body2:
          "Once the DPoS system is activated, in the event a validator votes incorrectly, the incorrect voting validator shall be subjected to a staking penalty. Those who delegated their stakes to the validator shall not be subject to penalties for the activities of the validator.",
      },
      rewards: {
        title:
          "What are the rewards that I can earn by staking on the Umbrella Network?",
        body: "Fees that Umbrella Network plans to charge clients shall be distributed on a pro-rata basis amongst those who have staked their Tokens. Umbrella's plan is to share 75% of fees on a pro-rata basis amongst those who have staked their Tokens. Umbrella Network will supplement or fully provide rewards to test the implementation of rewards in anticipation of fee-based rewards.",
      },
      help: {
        title:
          "I still need help, what's the best way to get in touch with the Umbrella team?",
        body: "The best way to get in touch with our team is by joining the <1>official Umbrella Network Discord server</1> and heading over to the #general-support channel. Our engineering team is always glad to hear your concerns and help you with any issues that might come up. You can also chat and get help from our ever-growing community, come say hi!",
      },
      sending: {
        title:
          "Is sending tokens to the staking contract another way of staking?",
        body1: "No, it’s not. Please ",
        body2: "DO NOT ",
        body3:
          "send tokens directly to our staking contract. If you send your tokens to our staking contract, ",
        body4: "they will be lost forever. ",
        body5:
          "Please contact the team if you are having issues with a transaction via our ",
        link1: "Discord Support Channel ",
        end: ".",
      },
      tokensLocked: {
        title: "Where did my tokens locked on Astro Stream go to?",
        body: "If you have locked tokens in the Astro Stream and never withdrew them, you can access them using this link: ",
      },
    },
  },
  liquidity: {
    intro: {
      body1:
        "Adding liquidity to a pool is a required step to participate on LP-related Umbrella STREAMS. In order to add liquidity to the ETH-UMB Pool on Uniswap V2, you should access",
      link1: "this Uniswap link",
      body2: "and follow the steps described below.",
    },
    note: {
      disclaimer: "*Please note:",
      body1: "Currently, our Polar STREAM only accepts Uniswap V2 LP Tokens.",
      body2:
        "If you have issues using the link above and finding Uniswap V2 see our step by step below. Otherwise, you can skip to",
      link1: "Step 4 - Set the amounts you want to supply",
      end: ".",
    },
    section1: {
      title: "Manually Entering Uniswap V2",
      body1: "Please go to: ",
      body2: "to begin providing liquidity.",
    },
    step1: {
      title: "Step 1 - Enter Uniswap V2 Liquidity",
      body: "The first thing to do after landing on Uniswap portal is to scroll to the View V2 Liquidity button and click on it.",
    },
    step2: {
      title: "Step 2 - Go to Add Liquidity",
      body: "After clicking on the View V2 Liquidity button, you will be able to see your V2 Liquidity. You can click on the Add V2 Liquidity button to enter a pool.",
    },
    step3: {
      title: "Step 3 - Start Providing",
      body: "You are now on the Uniswap V2 Add Liquidity page and are able to begin the process of providing liquidity to the ETH-UMB pair on Uniswap. In order to do so, please continue with the steps listed on the section below.",
    },
    section2: {
      title: "Entering Uniswap V2 Through Link",
    },
    step4: {
      title: "Step 4 - Set the amounts you want to supply",
      body: "The first thing to do after landing on Uniswap portal is to input the amounts you want to supply to the corresponding pool. You can also check prices and the Share of Pool your Supply represents. After making sure you filled the inputs with the desired values, click the button Supply. You will have a chance to check the amounts once again after this.",
    },
    step5: {
      title: "Step 5 - Confirm the supply",
      body: "After clicking on the Supply button, you will be prompted with a card containing the amount of UMB/ETH Pool Tokens you will receive as well as the amounts of UMB and ETH to deposit, rates and Share of Pool. After checking everything you should click on the Confirm Supply button, and proceed to the next step.",
    },
    step6: {
      title: "Step 6 - Confirm the transaction",
      body: "After clicking on the Confirm Supply button, you will be asked to confirm the transaction on MetaMask or any wallet supported by Uniswap you might be using. Once you do this, you should see the card shown below. Just as it says on it, the transaction was submitted and you should now wait for it to be minted. You can also take the opportunity to click on the Add UNI-V2 to Metamask button and quickly add this custom token to your wallet assets tab.",
    },
    step7: {
      title: "Step 7 - Check your Pools",
      body: "Once the transaction is minted, you will be able to verify your liquidity data by clicking on Pools tab, on Uniswap portal.",
    },
    step8: {
      title: "Step 8 - Start staking on Umbrella STREAMS",
      body: "You are now a liquidity provider on Uniswap UMB-ETH Pool! You can now head over to the Stake tab on our portal and stake tokens on the STREAM related to the pool you are participating. You can also find instructions on how to stake on our FAQ ",
      link1: "here",
      end: ".",
    },
  },
  tutorial: {
    intro: {
      body1:
        "If you are planning on staking on LP-related STREAMS, please visit ",
      link1: "this section",
      body2:
        " to learn how to add liquidity to an Uniswap pool before proceeding with How to Stake Tokens.",
      body3: "Navigate to ",
      link2: "https://staking.umb.network",
      body4:
        " and click on the 'Connect Wallet' button. Ensure that you have Metamask installed on your browser, Android device, or your iOS device, as the case may be.",
      body5:
        "Once successfully connected, enter the number of Tokens you want to stake from your balance and click on the 'Stake' button to get started.",
      body6: "For a step-by-step guide, see below:",
    },
    step1: {
      title: "Step 1 - Connecting your wallet",
      body: "Connect to your MetaMask wallet using the CONNECT WALLET button.",
    },
    step2: {
      title: "Step 2 - Staking",
      body1:
        "You can stake your Umbrella Tokens to farm more Umbrella Tokens over time.",
      body2: "The staking form can be found at the STAKE tab in the main page.",
      body3:
        "You can set all of your balance for staking by clicking the 'MAX' button located right next to the input.",
      body4:
        "Before staking, you have to set an amount of Umbrella Tokens for Allowance.",
      body5:
        "The amount of Tokens set for Allowance won't be removed from your balance.",
      body6:
        "This means that two contract operations will be called upon clicking the 'STAKE' button: Allowance and Staking.",
      body7:
        "If you want to skip the Allowance step, check the option labeled 'TRUST CONTRACT FOREVER'.",
      body8:
        "By doing so, you'll only have to go through the Allowance step once.",
      body9:
        "Otherwise, the same amount of UMB will be set for Allowance and Staking, meaning two transactions will be needed in order to stake tokens.",
    },
    step3: {
      title: "Step 3 - Withdrawing staked tokens",
      body1: "Withdraw your staked Tokens by going to the Withdraw form.",
      body2:
        "The withdraw form can be found at the WITHDRAW tab in the main page.",
      body3:
        "After setting how many Tokens you want to withdraw, click the WITHDRAW button to call a contract transaction.",
      body4:
        "You can also set all of your Tokens for withdraw by clicking the 'MAX' button displayed above.",
      body5:
        "Withdraw all of your staked Tokens while claiming all of your rewards in a single transaction by clicking the button labeled 'CLAIM REWARDS & WITHDRAW ALL'.",
    },
    step4: {
      title: "Step 4 - Claiming Rewards",
      body1:
        "Check your Token balances and rewards at the 'YOUR WALLET' card in the main page.",
      body2:
        "Claim Umbrella Tokens received as rewards by clicking the 'CLAIM REWARDS' button.",
    },
  },
};
