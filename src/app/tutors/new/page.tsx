import { auth } from "@/lib/auth";
import { TutorForm } from "./tutor-form";

export default async function NewTutorPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <section>
        <div className="form-page-head">
          <span className="eyebrow">Post yourself</span>
          <h2>Log in required</h2>
          <p>You need to be logged in to post a tutor profile.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="form-page-head">
        <span className="eyebrow">Post yourself</span>
        <h2>Post yourself as a tutor</h2>
      </div>
      <TutorForm />
    </section>
  );
}
