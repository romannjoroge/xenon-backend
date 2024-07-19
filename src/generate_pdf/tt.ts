// playground requires you to assign document definition to a variable called dd
interface PDFdata {
    serialno: string;
    section: string;
    proposal: string;
    justification: string;
}
export const content: PDFdata[]  = [
    {
        serialno: "001",
        section: "Introduction",
        proposal: "Implement a new user onboarding process.",
        justification: "To enhance the user experience and reduce churn rate."
    },
    {
        serialno: "002",
        section: "User Interface",
        proposal: "Redesign the main dashboard layout.",
        justification: "To improve accessibility and usability for all users."
    },
    {
        serialno: "003",
        section: "Backend",
        proposal: "Upgrade the server infrastructure.",
        justification: "To increase performance and scalability."
    },
    {
        serialno: "004",
        section: "Security",
        proposal: "Implement two-factor authentication.",
        justification: "To enhance security and protect user data."
    },
    {
        serialno: "005",
        section: "Marketing",
        proposal: "Launch a new social media campaign.",
        justification: "To increase brand awareness and attract new customers."
    }
];
