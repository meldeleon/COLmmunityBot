const lib = require("lib")({ token: process.env.STDLIB_SECRET_TOKEN })

await lib.discord.interactions["@1.0.0"].responses.modals.create({
  token: context.params.event.token,
  custom_id: `survey-modal`, // The unique custom id for this modal,
  title: `Leave feedback here!`,
  components: [
    {
      type: 1, // Component row
      components: [
        {
          type: 4, // Text input component, only valid in modals
          custom_id: "name",
          label: `What is the name of this faction?`,
          style: 1, // 1 for line, 2 for paragraph
          min_length: 1,
          max_length: 100,
          placeholder: "What is the name of this faction?",
          required: true,
        },
      ],
    },
    {
      type: 1, // You must use a new row for each text input
      components: [
        {
          type: 4, // Text input component, only valid in modals
          custom_id: "color",
          label: `What is the team color?`,
          style: 2,
          min_length: 1,
          max_length: 100,
          placeholder: "What is the team color?",
          required: true,
        },
      ],
    },
    {
      type: 1, // You must use a new row for each text input
      components: [
        {
          type: 4, // Text input component, only valid in modals
          custom_id: "commander?",
          label: `Who is the commander?`,
          style: 2,
          min_length: 1,
          max_length: 100,
          placeholder: "Who is the commander?",
          required: true,
        },
      ],
    },
  ],
})
