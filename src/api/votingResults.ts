import axios from 'axios';

interface ProposalData {
  title: string;
  yes: number;
  no: number;
  abstain: number;
  yes_wins: boolean;
  link: string
}


async function getVotingResults(proposalIds: string[]): Promise<Record<string, ProposalData | { error: string }>> {
  const url = "https://hub.snapshot.org/graphql";
  const headers = { "Content-Type": "application/json" };

  const results: Record<string, ProposalData | { error: string }> = {};

  for (const proposalId of proposalIds) {
    console.log("requesting proposal", proposalId);
    const payload = {
      query: `
        query ($id: String!) {
          proposal(id: $id) {
            id
            title
            choices
            scores
          }
        }
      `,
      variables: {
        id: proposalId
      }
    };

    try {
      const response = await axios.post<{ data: { proposal: { id: string; title: string; choices: string[]; scores: number[], link: string } } }>(url, payload, { headers });

      if (response.status === 200) {
        const data = response.data;
        const proposal = data?.data?.proposal;

        if (proposal) {
          const choices = proposal.choices || [];
          const scores = proposal.scores || [];
          const title = proposal.title || "Untitled";
          const link = 'https://snapshot.org/#/s:snapshot.dcl.eth/proposal/' + proposal.id

          const yesScore = choices.includes("yes") ? scores[choices.indexOf("yes")] : 0;
          const noScore = choices.includes("no") ? scores[choices.indexOf("no")] : 0;
          const abstainScore = choices.includes("abstain") ? scores[choices.indexOf("abstain")] : 0;

          // const totalVotes = yesScore + noScore + abstainScore;
          // const yesPercentage = totalVotes > 0 ? (yesScore / totalVotes) * 100 : 0;

          results[proposalId] = {
            title,
            yes: yesScore,
            no: noScore,
            abstain: abstainScore,
            yes_wins: yesScore > noScore,
            link
          };
        } else {
          results[proposalId] = { error: "Proposal not found" };
        }
      } else {
        results[proposalId] = { error: `HTTP error ${response.status}` };
      }
    } catch {
      results[proposalId] = { error: "Request failed" };
    }
  }

  return results;
}

const proposalIds =  [
  "0xf389cf86be84ac0a7cc80afc3330b1cb192d1bb3e00be27bd0dbc0b006c54387",
  "0xe19c1d960463859dcf12ab92a8591d73099e49ce0a340b702357bfaf04cd1fe5",
  "0x9f4c9f88d31cac355078681ea62ec98995e76d02cd96f75b2ac92911e9930afc",
  "0x02812e15e45b8d0c38990bf9ec688bde0a6089eb028588275dd3e3147e2a9606",
  "0x2a1eb0340b0a7b88e9fdc32c774503a514abf33224ead058a40a60d3efdef1ee",
  "0xf6e08feb0b8e9c798513ab678936793d57b9f37f3a3b94cc528871a7bd910d03",
  "0xfada0853bcb2cee72f3a5400bb5911cccc3feb144bb525aed325694490f46ecc",
  "0xcfc1ff92a826b23d0884535d7d042f17ab67d209a574b7213fd277c1b09963c8",
  "0xcf0f3483532bef515de324c9c12f05ae292ac79a96b0819374cfd8a087237b05",
  "0x784084a5f58a04939ba2e19ea75008f7891b2a9afbbcabf5e50be34cad55b635",
  "0x3b45d4c6a0759d23bc0b38999e213fdf8711de939b1148fc40669d486ce3df12",
  "0x8eca6d539c68899f1a887bd81b2427107edaee69dcf2ef2947b2f25f43fa4b0e",
  "0x6f2e673f3b48f0fcfdac3a0c0e630b16beed9815bec1297790d2fd9af25a1358",
  "0xaba8ba4fc028729f448a0c7fb518d836007991f94d798dd6c512df93bc5dbbb9",
  "0x8fd2bbb9e290dd3d7371aae05a0ffc8ba270b9ba091986ab6c68ae86a88390a4",
  "0xd5f53b9edc066a908e0c755a1f9cd031d624b07d1a2e8a9dd76f114a9c54a5bd",
  "0x1b9128a87c352c1413cc20102835c5d9ac2b4208f7d39312a964e01818c5c8b4",
  "0x66f5fea6efd85c93a8976c218818670252faf48fd854cc3227200be66c79cc01",
  "0xce8470b2b7227489907b6ff78f1e33d9b47ca1b80355f50e994e5cea110d7b34",
  "0xcdd676a99aa246cf167fc01f7c02d8c82762d5b05f354395d4d39d633cf5861b"
];

export async function fetchSortedResults() {
  const votingResults = await getVotingResults(proposalIds);
  const THRESHOLD = 6000000;
  const sortedResults = Object.entries(votingResults)
    .filter(([, data]) => !('error' in data) && (data as ProposalData).title.includes("Add") && (data as ProposalData).title.includes("DAO Council"))
    .map(([proposalId, data]) => {
      const proposalData = data as ProposalData;
      return {
        id: proposalId,
        name: proposalData.title.split("Add ")[1].split(" to DAO Council")[0],
        yes: proposalData.yes,
        no: proposalData.no,
        abstain: proposalData.abstain,
        yes_wins: proposalData.yes_wins,
        totalVotes: proposalData.yes + proposalData.no + proposalData.abstain,
        yesPercentage: (proposalData.yes / (proposalData.yes + proposalData.no + proposalData.abstain)) * 100 || 0,
        thresholdStatus: proposalData.yes >= THRESHOLD ? "PASS" : "FAIL",
        link: 'https://snapshot.org/#/s:snapshot.dcl.eth/proposal/' + proposalId
      };
    })
    .sort((a, b) => b.yes - a.yes);

return sortedResults;
}