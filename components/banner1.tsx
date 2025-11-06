import Image from "next/image";
import Link from "next/link";

function Banner1() {
  return (
    <div className="col-span-2 cursor-pointer md:col-span-4 relative rounded-4xl overflow-hidden">
      {/* <div className="flex top-0 bottom-0 group right-0 left-0 justify-between items-center">
        <Image
          draggable="false"
          src={"/2.png"}
          alt="Image"
          loading="lazy"
          height={500}
          width={500}
          className="md:h-80 h-32 w-auto -mb-24 group-hover:mb-0 md:group-hover:ms-8 group-hover:ms-2 group-hover:rotate-2 duration-700 rotate-12"
        />
        <Image
          draggable="false"
          src={"/1.png"}
          alt="Image"
          loading="lazy"
          height={500}
          width={500}
          className="md:h-80 h-32 w-auto -mt-24 group-hover:mt-0 md:group-hover:me-8 group-hover:me-2 group-hover:-rotate-2 duration-700 -rotate-12"
        />
      </div> */}
      <Link href={"https://instagram.com/vlonefarsi"} target="_blank">
        <div className="w-full text-center aspect-[5/2] md:aspect-[3/1] from-violet-700 to-violet-600 bg-gradient-to-br flex justify-center p-4 items-center">
          <div className="md:text-5xl text-3xl font-bold">
            تخفیف میخوای؟
            <div className="text-lg font-semibold mt-4">
              استوری‌های اینستارو از دست نده
              <br />
              تا کد تخفیف‌ها رو پیدا کنی
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Banner1;
