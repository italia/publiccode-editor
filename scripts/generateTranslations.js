
const fields = require("./fields");

console.log(fields.length);


const out= fields
	.map(
	({ title, label, description }) => ({
		[`field-${title}-label`]: label,
		[`field-${title}-description`]: description
	})
)
.reduce((prev, curr)=> ({ ...prev, ...curr }), {});

console.log(JSON.stringify(out, null, 2));

