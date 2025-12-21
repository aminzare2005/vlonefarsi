import React from "react";
import { Button } from "./ui/button";
import { DownloadCloudIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  id: string;
  image_url: string;
};
function AdminBar(props: Props) {
  return (
    <div className="h-[50dvh] flex z-50 justify-start items-center top-0 right-0 fixed">
      <div className="bg-card flex flex-col gap-2 border border-r-0 rounded-l-md">
        <Link
          href={`/dashboard/mockup?image_url=${props.image_url}&id=${props.id}`}
        >
          <Button variant="ghost">
            <DownloadCloudIcon />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AdminBar;
