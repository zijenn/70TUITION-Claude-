import { auth } from "@/lib/auth";
import { StudentForm } from "./student-form";

export default async function NewStudentPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <section>
        <div className="form-page-head">
          <span className="eyebrow">Post yourself</span>
          <h2>Log in required</h2>
          <p>You need to be logged in to post a student profile.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="form-page-head">
        <span className="eyebrow">Post yourself</span>
        <h2>Post yourself as a student</h2>
      </div>
      <StudentForm />
    </section>
  );
}
