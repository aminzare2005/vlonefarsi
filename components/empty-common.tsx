import { CctvIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "./ui/empty";

function EmptyCommon() {
  return (
    <Empty className="min-h-[70dvh]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CctvIcon />
        </EmptyMedia>
        <EmptyTitle>یه مشکلی پیش اومده!</EmptyTitle>
        <EmptyDescription>
          نتونستیم دیتایی دریافت کنیم لطفا چند ثانیه دیگه دوباره امتحان کن
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          <RefreshCcwIcon />
          رفرش
        </Button>
      </EmptyContent>
    </Empty>
  );
}

export default EmptyCommon;
