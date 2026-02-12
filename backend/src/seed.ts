import prisma from "./prisma";

async function main() {
    // Clear existing data
    await prisma.announcementCategory.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.category.deleteMany();

    // Seed categories
    const categoryNames = ["Company News", "Product Update", "Event", "HR", "Engineering", "Marketing"];

    const categories = await Promise.all(categoryNames.map((name) => prisma.category.create({ data: { name } })));

    const catMap = new Map(categories.map((c) => [c.name, c.id]));

    // Seed announcements
    const announcements = [
        {
            title: "Q1 Company All-Hands Meeting",
            body: "Join us for the quarterly all-hands meeting where we will review our progress, celebrate achievements, and discuss the roadmap for the upcoming quarter.",
            publicationDate: new Date("2025-01-15T10:00:00.000Z"),
            createdAt: new Date("2025-01-10T08:00:00.000Z"),
            updatedAt: new Date("2025-01-14T16:30:00.000Z"),
            categories: ["Company News", "Event"],
        },
        {
            title: "New Feature: Dark Mode Released",
            body: "We are excited to announce that dark mode is now available across all platforms. Users can toggle it in their settings. This has been one of our most requested features.",
            publicationDate: new Date("2025-02-01T09:00:00.000Z"),
            createdAt: new Date("2025-01-28T14:00:00.000Z"),
            updatedAt: new Date("2025-02-01T09:00:00.000Z"),
            categories: ["Product Update", "Engineering"],
        },
        {
            title: "Summer Internship Program 2025",
            body: "Applications are now open for our summer internship program. We are looking for talented individuals in engineering, design, and marketing. Apply before March 31st.",
            publicationDate: new Date("2025-02-10T12:00:00.000Z"),
            createdAt: new Date("2025-02-05T10:00:00.000Z"),
            updatedAt: new Date("2025-02-10T12:00:00.000Z"),
            categories: ["HR"],
        },
        {
            title: "Infrastructure Migration to Cloud",
            body: "Our engineering team has successfully completed the migration of our core services to the cloud. This improves reliability, scalability, and reduces operational costs.",
            publicationDate: new Date("2025-02-20T14:00:00.000Z"),
            createdAt: new Date("2025-02-18T09:00:00.000Z"),
            updatedAt: new Date("2025-02-22T11:00:00.000Z"),
            categories: ["Engineering", "Company News"],
        },
        {
            title: "Marketing Campaign: Spring Launch",
            body: "Our spring marketing campaign kicks off next week. The campaign includes social media, email newsletters, and partnerships with key influencers in our industry.",
            publicationDate: new Date("2025-03-01T08:00:00.000Z"),
            createdAt: new Date("2025-02-25T16:00:00.000Z"),
            updatedAt: new Date("2025-03-01T08:00:00.000Z"),
            categories: ["Marketing"],
        },
        {
            title: "Updated Employee Benefits Package",
            body: "We have updated our employee benefits package to include additional wellness programs, flexible work arrangements, and increased parental leave. Check the HR portal for details.",
            publicationDate: new Date("2025-03-05T10:00:00.000Z"),
            createdAt: new Date("2025-03-01T12:00:00.000Z"),
            updatedAt: new Date("2025-03-06T09:00:00.000Z"),
            categories: ["HR", "Company News"],
        },
        {
            title: "API v2.0 Documentation Available",
            body: "The documentation for API version 2.0 is now live. It includes new endpoints for batch operations, improved authentication, and comprehensive code examples.",
            publicationDate: new Date("2025-03-10T11:00:00.000Z"),
            createdAt: new Date("2025-03-08T15:00:00.000Z"),
            updatedAt: new Date("2025-03-10T11:00:00.000Z"),
            categories: ["Product Update", "Engineering"],
        },
        {
            title: "Annual Company Retreat",
            body: "Save the date! Our annual company retreat will take place June 15-17. This year we are heading to the mountains for team-building activities, workshops, and fun.",
            publicationDate: new Date("2025-03-15T09:00:00.000Z"),
            createdAt: new Date("2025-03-12T10:00:00.000Z"),
            updatedAt: new Date("2025-03-15T09:00:00.000Z"),
            categories: ["Event", "HR"],
        },
        {
            title: "Customer Satisfaction Survey Results",
            body: "We achieved a 92% customer satisfaction rate in Q1. Thank you to everyone who contributed to this success. We will continue improving based on the feedback received.",
            publicationDate: new Date("2025-03-20T13:00:00.000Z"),
            createdAt: new Date("2025-03-18T11:00:00.000Z"),
            updatedAt: new Date("2025-03-21T08:00:00.000Z"),
            categories: ["Company News", "Marketing"],
        },
        {
            title: "Security Update: Two-Factor Authentication",
            body: "Two-factor authentication is now mandatory for all employee accounts. Please set it up by the end of this month using the instructions provided in the security portal.",
            publicationDate: new Date("2025-03-25T10:00:00.000Z"),
            createdAt: new Date("2025-03-22T14:00:00.000Z"),
            updatedAt: new Date("2025-03-25T10:00:00.000Z"),
            categories: ["Engineering", "Company News"],
        },
    ];

    for (const ann of announcements) {
        await prisma.announcement.create({
            data: {
                title: ann.title,
                body: ann.body,
                publicationDate: ann.publicationDate,
                createdAt: ann.createdAt,
                updatedAt: ann.updatedAt,
                categories: {
                    create: ann.categories.map((catName) => ({
                        categoryId: catMap.get(catName)!,
                    })),
                },
            },
        });
    }

    console.log("Database seeded successfully!");
    console.log(`  - ${categoryNames.length} categories`);
    console.log(`  - ${announcements.length} announcements`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
