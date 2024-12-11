import { BlogList } from "./components/BlogList";
import { fetchBlogs } from "./api/blog";
import { catchError } from "./utils/utils";

export default async function Home() {
  const [error, initialData] = await catchError(fetchBlogs(1));
  console.log("initialData", initialData ? initialData : error);

  if (error) {
    return <div>Failed to load blogs - {JSON.stringify(error)}</div>;
  } else {
    return <BlogList initialData={initialData} />;
  }
}
