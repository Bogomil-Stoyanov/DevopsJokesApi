/**
 * Seed: Programming and DevOps jokes
 *
 * Populates the jokes table with 20+ funny programming/DevOps jokes
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("jokes").del();

  // Inserts seed entries
  await knex("jokes").insert([
    {
      content:
        "Why do programmers prefer dark mode? Because light attracts bugs!",
    },
    {
      content:
        'A programmer\'s partner asks: "Could you go to the store and get a liter of milk? And if they have eggs, get a dozen." The programmer returns with 12 liters of milk and says: "They had eggs."',
    },
    { content: "Why do Java developers wear glasses? Because they can't C#!" },
    {
      content:
        'A SQL query walks into a bar, walks up to two tables and asks: "Can I join you?"',
    },
    {
      content:
        "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
    },
    {
      content:
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
    },
    {
      content:
        "Why did the developer go broke? Because he used up all his cache!",
    },
    { content: '"Knock, knock." "Who\'s there?" *very long pause* "Java."' },
    {
      content:
        "There are 10 types of people in the world: those who understand binary and those who don't.",
    },
    {
      content:
        "Why do programmers prefer iOS development? Because they love Swift justice!",
    },
    {
      content:
        'A DevOps engineer walks into a bar. Bartender says, "Sorry, we\'re closed for deployment."',
    },
    {
      content:
        "Why did the DevOps engineer quit their job? They couldn't handle the continuous stress!",
    },
    {
      content:
        "What's a DevOps engineer's favorite place? The cloud, because there's no on-premises drama!",
    },
    {
      content:
        "Why don't DevOps engineers ever get locked out? They always have the right keys... and secrets!",
    },
    {
      content:
        'How does a DevOps engineer make coffee? git commit -m "Initial pour" && docker-compose up coffee',
    },
    {
      content:
        "Why did the container break up with the VM? It needed less overhead in the relationship!",
    },
    {
      content:
        "What's a DevOps engineer's favorite exercise? Pipeline push-ups!",
    },
    {
      content:
        "Why do DevOps engineers love pets? Because they understand that cattle vs pets is about infrastructure, not animals!",
    },
    {
      content:
        'What did the developer say after deploying to production on Friday? "YOLO! ...wait, where\'s my rollback button?"',
    },
    {
      content:
        "Why did the Kubernetes pod go to therapy? It had too many unhealthy probes!",
    },
    { content: "How do you comfort a JavaScript bug? You console it!" },
    {
      content:
        "Why do programmers hate nature? It has too many bugs and no debugger!",
    },
    { content: "What's a programmer's favorite hangout place? The Foo Bar!" },
    {
      content:
        "Why did the functions stop calling each other? Because they had constant arguments!",
    },
    {
      content:
        "How do you tell HTML from HTML5? Try it out in Internet Explorer. Did it work? No? It's HTML5!",
    },
    {
      content:
        'Why do programmers prefer Unix? Because "Windows" are for seeing outside, not coding!',
    },
    {
      content: "What's the object-oriented way to become wealthy? Inheritance!",
    },
    {
      content:
        'Why did the developer get stuck in the shower? The shampoo bottle said: "Lather, Rinse, Repeat" - an infinite loop!',
    },
    {
      content:
        "How do you generate a random string? Put a fresh graduate in front of Kubernetes and ask them to deploy!",
    },
    {
      content:
        "Why don't programmers like to go outside? The sun causes too much glare on their screens!",
    },
  ]);

  console.log("✓ Seeded 30 jokes successfully");
};
