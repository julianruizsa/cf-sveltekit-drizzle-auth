import { json } from "@sveltejs/kit";

export async function POST({ request, cookies }) {
  // const { description } = await request.json();

  // const userid = cookies.get('userid');
  // const { id } = await database.createTodo({ userid, description });

  return json({ hello: "World" }, { status: 201 });
}

export async function GET() {
  return json({ hello: "World" }, { status: 200 });
}
