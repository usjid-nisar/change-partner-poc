import * as React from "react";

const MaleSVGComponent = ({ textMapping = {}, ...props }) => {
  // Helper function to get mapped text or original text
  const getMappedText = (id) => {
    return textMapping[id] || id;
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 953 977"
      width={953}
      height={977}
      {...props}
    >
      <title>{"Group 4"}</title>
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id="cp1">
          <path d="m0 0h953v1277h-953z" />
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse" id="cp2">
          <path d="m633.92 865.39c-27.49-52.28-40.41-108.17-32.58-172.28l23.44-0.31c58.29-14.61 44.8-3.65 86.32-50.58 1.86 10.43-4.06 20.88 5.55 31.31-0.12-34.54 14.55-30.71 30.78-58.9-2 16.84-4.1 16.63 2.21 33.12 16.65-28.75 40.11-30.79 72.32-44.91 62.63-45.42 65.33-62.65 58.51-134.39 11.71 16.51 22.8 21.87 33.43 18.39-53.72-15.52-44.3-140.18-56.67-186.55-5.54-20.76-28.16-38.6-66.96-88.19l-34.78-44.45c-11.77-15.04-17.11-28.63-32.7-39.57-29.02-20.42-66.5-34.68-103.45-48.06-71.37-25.84-66.42-26.4-143.49-24.54-79.72-12.53-64.57-11.19-129.59 11.35-18.56 6.43-40.94 10.06-61.56 13.71-17.75 3.13-23.3 17.02-31.52 32.6-9.16 17.33 14.55 45.32 23 61.66-33.85 46.7-56.03 76.13-81.51 121.39-16.54 29.36-12.02 75.67-14.66 79.46-17.3 24.88-48.55 39.49-72.96 57.81-9.77 5.85-19.94 11.93-18.99 25.16 0.85 11.96 19.88 23.83 29.24 30.07 5.05 19.85 0.22 27.66-15.12 41.53-5.11 16.85 4.99 23.35 19.51 38.14-17.77 17.19-17.38 14.04-15.36 39.26l12.37 3.47c12.51 3.5 3.44 18.73-0.29 25.16-25.26 64.69 55.39 55.19 93.1 49.44 29.65-4.54 57.31 1.09 74.08 13.04 31.91 22.8 40.77 68.59 64.61 111.08 18.22 68.32 29.21 97.44 31.6 163 0.56 15.37 0.04 16.28-5.11 30.72-21.94 21.27-22.78 40.77-29.07 68.63-4.23 18.69-15.71 44.78-19.75 64.2-17.5 46.78-32.82 83.96-49.69 120.64h526.15c-22.12-105.72-57.89-224.18-111.57-295.59-23.82-31.67-44.54-68.85-58.8-96.02z" />
        </clipPath>
        <text width={79} height={27} id="img1">
          {getMappedText("D12")}
        </text>
        <text width={135} height={25} id="img2">
          (d =  {getMappedText("(d = 12.0)")})
        </text>
        <text width={109} height={31} id="img3">
          {getMappedText("D11")}
        </text>
        <text width={80} height={24} id="img4">
          {getMappedText("D10")}
        </text>
        <text width={125} height={23} id="img5">
        (d = {getMappedText("(d = 10.0)")})
        </text>
        <text width={130} height={24} id="img6">
        (d = {getMappedText("(d = 11.0)")})
        </text>
        <text width={101} height={29} id="img7">
          {getMappedText("D9")}
        </text>
        <text width={104} height={23} id="img8">
        (d = {getMappedText("(d = 9.0)")})
        </text>
        <text width={101} height={22} id="img9">
        (d = {getMappedText("(d = 8.0)")})
        </text>
        <text width={96} height={20} id="img10">
        (d = {getMappedText("(d = 7.0)")}
        </text>
        <text width={58} height={19} id="img11">
          {getMappedText("D7")}
        </text>
        <text width={63} height={22} id="img12">
          {getMappedText("D6")}
        </text>
        <text width={92} height={19} id="img13">
        (d = {getMappedText("(d = 6.0)")})
        </text>
        <text width={87} height={19} id="img14">
        (d = {getMappedText("(d = 5.0)")})
        </text>
        <text width={83} height={18} id="img15">
        (d = {getMappedText("(d = 4.0)")})
        </text>
        <text width={79} height={17} id="img16">
        (d = {getMappedText("(d = 3.0)")}
        </text>
        <text width={74} height={16} id="img17">
        (d ={getMappedText("(d = 2.0)")}
        </text>
        <text width={70} height={16} id="img18">
          (d = {getMappedText("(d = 1.0)")})
        </text>
        <text width={40} height={22} id="img19">
          {getMappedText("D5")}
        </text>
        <text width={58} height={17} id="img20">
          {getMappedText("D4")}
        </text>
        <text width={57} height={16} id="img21">
          {getMappedText("D3")}
        </text>
        <text width={47} height={15} id="img22">
          {getMappedText("D2")}
        </text>
        <text width={65} height={14} id="img23">
          {getMappedText("D1")}
        </text>
        <text width={111} height={26} id="img24">
          {getMappedText("D8")}
        </text>
      </defs>
      <style>
        {
          "\n\t\t.s0 {\n\t\t\tfill: #3a256e\n\t\t}\n\n\t\t.s1 {\n\t\t\tfill: none;\n\t\t\tstroke: #231f20;\n\t\t\tstroke-miterlimit: 10\n\t\t}\n\n\t\t.s2 {\n\t\t\tfill: #ffffff;\n\t\t\tstroke: #231f20;\n\t\t\tstroke-miterlimit: 10\n\t\t}\n\n\t\t.s3 {\n\t\t\tfill: none;\n\t\t\tstroke: #231f20;\n\t\t\tstroke-width: 2\n\t\t}\n\n\t\t.s4 {\n\t\t\tfill: #ffffff;\n\t\t\tstroke: #231f20;\n\t\t\tstroke-width: 2\n\t\t}\n\t"
        }
      </style>
      <g id="Clip-Path" clipPath="url(#cp1)">
        <path
          fillRule="evenodd"
          className="s0"
          d="m703.2 1043c-27.3-36.6-51-79.5-67.3-110.8-31.4-60.4-46.3-124.9-37.3-198.9l26.9-0.4c66.6-16.9 51.2-4.2 98.7-58.4 2.1 12-4.7 24.1 6.3 36.1-0.1-39.8 16.7-35.4 35.2-68-2.3 19.5-4.6 19.3 2.6 38.3 19-33.2 45.9-35.6 82.7-51.9 71.6-52.4 74.7-72.3 66.9-155.1 13.4 19 26.1 25.2 38.3 21.2-61.5-17.9-50.7-161.8-64.9-215.4-6.3-24-32.2-44.5-76.6-101.8l-39.8-51.3c-13.4-17.4-19.5-33-37.3-45.7-33.3-23.6-76.1-40-118.4-55.5-81.6-29.8-76-30.5-164.1-28.3-91.2-14.5-73.9-12.9-148.3 13.1-21.2 7.4-46.8 11.6-70.4 15.8-20.3 3.6-26.7 19.7-36.1 37.6-10.5 20 16.7 52.3 26.3 71.2-38.7 53.9-64.1 87.9-93.2 140.2-18.9 33.9-13.8 87.4-16.8 91.7-19.8 28.8-55.5 45.6-83.5 66.8-11.1 6.7-22.8 13.8-21.7 29 1 13.8 22.7 27.5 33.4 34.8 5.8 22.8 0.3 31.9-17.2 47.9-5.9 19.4 5.7 26.9 22.3 44-20.4 19.9-19.9 16.2-17.6 45.3l14.2 4c14.3 4.1 3.9 21.7-0.4 29.1-28.9 74.7 63.4 63.7 106.5 57.1 33.9-5.3 65.6 1.2 84.8 15 36.5 26.3 46.6 79.2 73.9 128.3 20.8 78.9 33.4 112.5 36.1 188.2 0.7 17.7 0.1 18.8-5.8 35.4-25.1 24.6-26.1 47.1-33.3 79.2-4.8 21.6-17.9 51.7-22.6 74.2"
        />
        <path
          fillRule="evenodd"
          className="s1"
          d="m703.2 1043c-27.3-36.6-51-79.5-67.3-110.8-31.4-60.4-46.3-124.9-37.3-198.9l26.9-0.4c66.6-16.9 51.2-4.2 98.7-58.4 2.1 12-4.7 24.1 6.3 36.1-0.1-39.8 16.7-35.4 35.2-68-2.3 19.5-4.6 19.3 2.6 38.3 19-33.2 45.9-35.6 82.7-51.9 71.6-52.4 74.7-72.3 66.9-155.1 13.4 19 26.1 25.2 38.3 21.2-61.5-17.9-50.7-161.8-64.9-215.4-6.3-24-32.2-44.5-76.6-101.8l-39.8-51.3c-13.4-17.4-19.5-33-37.3-45.7-33.3-23.6-76.1-40-118.4-55.5-81.6-29.8-76-30.5-164.1-28.3-91.2-14.5-73.9-12.9-148.3 13.1-21.2 7.4-46.8 11.6-70.4 15.8-20.3 3.6-26.7 19.7-36.1 37.6-10.5 20 16.7 52.3 26.3 71.2-38.7 53.9-64.1 87.9-93.2 140.2-18.9 33.9-13.8 87.4-16.8 91.7-19.8 28.8-55.5 45.6-83.5 66.8-11.1 6.7-22.8 13.8-21.7 29 1 13.8 22.7 27.5 33.4 34.8 5.8 22.8 0.3 31.9-17.2 47.9-5.9 19.4 5.7 26.9 22.3 44-20.4 19.9-19.9 16.2-17.6 45.3l14.2 4c14.3 4.1 3.9 21.7-0.4 29.1-28.9 74.7 63.4 63.7 106.5 57.1 33.9-5.3 65.6 1.2 84.8 15 36.5 26.3 46.6 79.2 73.9 128.3 20.8 78.9 33.4 112.5 36.1 188.2 0.7 17.7 0.1 18.8-5.8 35.4-25.1 24.6-26.1 47.1-33.3 79.2-4.8 21.6-17.9 51.7-22.6 74.2"
        />
        <path
          fillRule="evenodd"
          className="s2"
          d="m632.9 866.4c-27.5-52.3-40.4-108.2-32.6-172.3l23.5-0.3c58.3-14.6 44.8-3.6 86.3-50.6 1.9 10.5-4.1 20.9 5.5 31.3-0.1-34.5 14.6-30.7 30.8-58.9-2 16.9-4.1 16.7 2.2 33.1 16.7-28.7 40.2-30.7 72.4-44.9 62.6-45.4 65.3-62.6 58.5-134.3 11.7 16.5 22.8 21.8 33.4 18.3-53.7-15.5-44.3-140.1-56.7-186.5-5.5-20.8-28.1-38.6-66.9-88.2l-34.8-44.5c-11.8-15-17.1-28.6-32.7-39.5-29-20.4-66.5-34.7-103.5-48.1-71.3-25.8-66.4-26.4-143.4-24.5-79.8-12.6-64.6-11.2-129.6 11.3-18.6 6.5-41 10.1-61.6 13.7-17.8 3.2-23.3 17.1-31.5 32.6-9.2 17.4 14.5 45.4 23 61.7-33.9 46.7-56.1 76.1-81.5 121.4-16.6 29.4-12.1 75.7-14.7 79.5-17.3 24.8-48.5 39.4-73 57.8-9.7 5.8-19.9 11.9-18.9 25.1 0.8 12 19.8 23.8 29.2 30.1 5.8 22.8 0.3 31.9-17.2 47.9-5.9 19.4 5.7 26.9 22.3 44-20.4 19.9-19.9 16.2-17.6 45.3l14.2 4c14.3 4.1 3.9 21.7-0.4 29.1-28.9 74.7 63.4 63.7 106.5 57.1 33.9-5.3 65.6 1.2 84.8 15 36.5 26.3 46.6 79.2 73.9 128.3 20.8 78.9 33.4 112.5 36.1 188.2 0.7 17.7 0.1 18.8-5.8 35.4-25.1 24.6-26.1 47.1-33.3 79.2-4.8 21.6-17.9 51.7-22.6 74.2"
        />
      </g>
      <g id="Clip-Path" clipPath="url(#cp2)">
        <g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m714 346.9h54.2c7.1 0 7.9 6 7.9 9.1 0 6.6-8 8.2-8 20.3 0 10.1 8.1 18.4 18.2 18.7 10.1-0.3 18.2-8.6 18.2-18.7 0-12.1-8-13.7-8-20.3 0-3.1 0.8-9.1 7.9-9.1h53.5v53.3m-143.9 90.6c20.9 0 54.2 0 54.2 0 7.1 0 7.9-5.9 7.9-9 0-6.7-8-8.2-8-20.3 0-10.1 8.1-18.4 18.2-18.8 10.1 0.4 18.2 8.7 18.2 18.8 0 12.1-8 13.6-8 20.3 0 3.1 0.8 9 7.9 9h53.5v-92"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m356.9 616.2h-39.2c-6.2 0-6.9 5.2-6.9 8 0 5.8 7 7.2 7 17.8 0 9.1-7.4 16.5-16.5 16.5-9.2 0-16.6-7.4-16.6-16.5 0-10.6 7.1-16.4 7.1-17.8 0-0.7-0.8-8-6.9-8h-40.1v-45.8c0-6.2 5.2-6.9 8-6.9 5.8 0 7.2 7 17.8 7 8.9 0 16.1-7.1 16.5-15.9-0.4-8.9-7.6-16-16.5-16-10.6 0-12 7.1-17.8 7.1-2.8 0-8-0.8-8-6.9v-48.8h112.1"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              className="s4"
              d="m357.8 489.8h-1v1 59.5c0 3.5-1.5 5.4-3.2 6.4-1.9 1.1-4.2 1.3-5.9 1.3-2.8 0-4.6-1.4-7.1-3.2q-0.6-0.5-1.4-1c-3.1-2.4-7.2-4.7-14.2-4.7-12.2 0-22 9.9-22 22 0 12.1 9.8 22 22 22 7 0 12.4-2.3 16.2-4.6 1.8-1.1 3.2-2.1 4.4-2.9q0.1-0.1 0.2-0.2 0.9-0.7 1.4-1 0.3-0.1 0.4-0.2 0.1 0 0.1 0c0.4 0 2.7 0.2 4.9 1.3 2.2 1.1 4.2 3 4.2 6.4v59.5 1h1 59.6c4.3 0 6.8-1.9 8.2-4.3 1.4-2.3 1.6-5 1.6-6.8 0-3.5-1.8-6-3.7-8.4q-0.5-0.6-0.9-1.2c-2.2-3-4.3-6.6-4.3-13 0-10.8 8.5-19.6 19.3-20 10.7 0.4 19.2 9.2 19.2 20 0 6.4-2.1 10-4.2 13q-0.5 0.6-1 1.2c-1.9 2.4-3.7 4.9-3.7 8.4 0 1.8 0.2 4.5 1.6 6.8 1.4 2.4 3.9 4.3 8.2 4.3h59.6 1v-1-59.5c0-3.4 2-5.3 4.2-6.4 2.2-1.1 4.5-1.3 4.9-1.3q0 0 0.1 0 0.1 0.1 0.4 0.2 0.5 0.3 1.4 1 0.1 0.1 0.3 0.2c1.1 0.8 2.5 1.8 4.3 2.9 3.8 2.3 9.2 4.6 16.2 4.6 12.2 0 22.1-9.9 22.1-22 0-12.1-9.9-22-22.1-22-7 0-11 2.3-14.2 4.7q-0.7 0.5-1.4 1c-2.4 1.8-4.3 3.2-7.1 3.2-1.6 0-4-0.2-5.8-1.3-1.8-1-3.3-2.9-3.3-6.4v-59.5-1h-1-59.6c-4.3 0-6.8 1.9-8.2 4.3-1.4 2.3-1.6 5-1.6 6.8 0 3.5 1.8 6 3.7 8.4q0.5 0.6 1 1.2c2.1 3 4.2 6.6 4.2 13 0 10.8-8.5 19.6-19.2 20-10.8-0.4-19.3-9.2-19.3-20 0-6.4 2.1-10 4.3-13q0.4-0.6 0.9-1.2c1.9-2.4 3.7-4.9 3.7-8.4 0-1.8-0.2-4.5-1.6-6.8-1.4-2.4-3.9-4.3-8.2-4.3z"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m714.3 491.8v41.2c0 5.4-4.6 6.1-7 6.1-5.1 0-6.4-6.2-15.7-6.2-8.1 0-14.6 6.5-14.6 14.5 0 8.1 6.5 14.6 14.6 14.6 9.3 0 14.4-6.2 15.7-6.2 0.6 0 7 0.6 7 6.1v41.1h41.3c5.4 0 6.1-4.6 6.1-7 0-5.1-6.2-6.3-6.2-15.6 0-7.9 6.2-14.3 14-14.5 7.8 0.2 14.1 6.6 14.1 14.5 0 9.3-6.2 10.5-6.2 15.6 0 2.4 0.6 7 6 7h41.3v-41.1c0-5.5 6.4-6.1 7-6.1 1.3 0 6.4 6.2 15.7 6.2 8.1 0 14.6-6.5 14.6-14.6 0-8-6.5-14.5-14.6-14.5-9.3 0-10.5 6.2-15.7 6.2-2.4 0-7-0.7-7-6.1v-41.2"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m244 595.4h-39c-5.1 0-5.7-4.4-5.7-6.7 0-4.8 5.8-6 5.8-14.8 0-7.4-5.9-13.5-13.3-13.8-7.3 0.3-13.2 6.4-13.2 13.8 0 8.8 5.8 10 5.8 14.8 0 2.3-0.6 6.7-5.7 6.7h-39.1v-39c0-5.2-6-5.8-6.6-5.8-1.2 0-6 5.9-14.8 5.9-7.6 0-13.8-6.2-13.8-13.8 0-7.6 6.2-13.8 13.8-13.8 8.8 0 10 5.9 14.8 5.9 2.3 0 6.6-0.7 6.6-5.8v-39h39.1c5.1 0 5.7 4.4 5.7 6.6 0 4.9-5.8 6-5.8 14.9 0 7.4 5.9 13.4 13.2 13.7 7.4-0.2 13.3-6.3 13.3-13.7 0-8.9-5.8-10-5.8-14.9 0-2.2 0.6-6.6 5.7-6.6h39"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m243 322.3h-70.6v48.5c0 6.4 5.4 7.2 8.2 7.2 6.1 0 7.5-7.3 18.5-7.3 9.2 0 16.8 7.3 17.1 16.5-0.3 9.2-7.9 16.5-17.1 16.5-11 0-12.4-7.3-18.5-7.3-2.8 0-8.2 0.8-8.2 7.2v86.4h8.6"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m518.7 633.7h80.4c6.5 0 7.3 7.6 7.3 8.3 0 1.6-7.4 7.6-7.4 18.7 0 9.6 7.8 17.4 17.4 17.4 9.6 0 17.3-7.8 17.3-17.4 0-11.1-7.3-12.6-7.3-18.7 0-2.8 0.7-8.3 7.2-8.3h80.4v-32.4"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m302.4 321.3v62.3c0 8.3-9.8 9.3-10.7 9.3-2 0-9.7-9.4-24-9.4-12.3 0-22.3 9.9-22.3 22 0 12.2 10 22.1 22.3 22.1 14.3 0 16.1-9.4 24-9.4 3.7 0 10.7 1 10.7 9.2v62.4h77.6"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m394.3 652.4v32.1c0 4.2-3.6 4.7-5.5 4.7-4 0-4.9-4.8-12.2-4.8-6.2 0-11.3 5-11.3 11.3 0 6.3 5.1 11.3 11.3 11.3 7.3 0 11.2-4.8 12.2-4.8 0.5 0 5.5 0.5 5.5 4.7v32.1h32.1c4.2 0 4.7-3.6 4.7-5.5 0-3.9-4.8-4.9-4.8-12.1 0-6.2 4.8-11.1 10.9-11.3 6 0.2 10.9 5.1 10.9 11.3 0 7.2-4.8 8.2-4.8 12.1 0 1.9 0.5 5.5 4.7 5.5h32.1v-32.1c0-4.2 5-4.7 5.4-4.7 1 0 5 4.8 12.2 4.8 6.3 0 11.4-5 11.4-11.3 0-6.3-5.1-11.3-11.4-11.3-7.2 0-8.2 4.8-12.2 4.8-1.8 0-5.4-0.5-5.4-4.7v-32.1"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m714 322.3v72.3c0 9.5-8.1 10.7-12.3 10.7-9 0-11.1-10.9-27.5-10.9-13.8 0-25 11-25.5 24.6 0.5 13.7 11.7 24.6 25.5 24.6 16.4 0 18.5-10.8 27.5-10.8 4.2 0 12.3 1.1 12.3 10.6v72.4h-72.3c-9.5 0-10.6 8-10.6 12.3 0 8.9 10.8 11.1 10.8 27.5 0 14.1-11.4 25.5-25.5 25.5-14.1 0-25.6-11.4-25.6-25.5 0-16.4 10.9-25.3 10.9-27.5 0-1.1-1.2-12.3-10.7-12.3h-72.3v-72.4c0-9.5 8.1-10.6 12.4-10.6 8.9 0 11 10.8 27.4 10.8 13.8 0 25-10.9 25.5-24.6-0.5-13.6-11.7-24.6-25.5-24.6-16.4 0-18.5 10.9-27.4 10.9-4.3 0-12.4-1.2-12.4-10.7v-72.3"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              fillRule="evenodd"
              className="s3"
              d="m504 97.2h80.3c11 0 12.3 9.3 12.3 14.2 0 10.3-12.5 12.8-12.5 31.7 0 15.9 12.6 28.8 28.4 29.3 15.7-0.5 28.4-13.4 28.4-29.3 0-18.9-12.6-21.4-12.6-31.7 0-4.9 1.4-14.2 12.3-14.2h73.4v83.3m-210 141.8c32.5 0 80.3 0 80.3 0 11 0 12.3-9.3 12.3-14.2 0-10.3-12.5-12.8-12.5-31.7 0-15.9 12.6-28.8 28.4-29.3 15.7 0.5 28.4 13.4 28.4 29.3 0 18.9-12.6 21.4-12.6 31.7 0 4.9 1.4 14.2 12.3 14.2h73.4v-143.9"
            />
          </g>
          <g
            style={{
              opacity: 0.9,
            }}
          >
            <path
              className="s4"
              d="m503.3 46.4v-1h-1-258.3-1v1 108.4c0 6.9 3 10.9 6.8 13.1 3.7 2.1 8.2 2.5 11.2 2.5 5.6 0 9.4-2.9 13.5-6q1-0.8 2.1-1.6c5-3.7 11.1-7.3 22.1-7.3 18.4 0 33.3 14.6 34 32.8-0.7 18.3-15.6 32.8-34 32.8-11 0-17.1-3.6-22.1-7.2q-1.1-0.8-2.1-1.6c-4.1-3.1-7.9-6.1-13.5-6.1-3 0-7.4 0.4-11.2 2.6-3.8 2.2-6.8 6.2-6.8 13.1v99.3 1h1 89.4c6 0 9.4 3.6 11.3 7.4 1.9 3.9 2.3 7.9 2.3 8.5q0 0 0 0.1 0 0.1-0.1 0.2-0.1 0.3-0.4 0.8-0.6 0.9-1.6 2.4-0.2 0.2-0.4 0.5c-1.3 1.8-3.1 4.2-4.8 7.1-3.8 6.4-7.6 15.2-7.6 26.7 0 19.9 16.1 36.1 36.1 36.1 19.9 0 36-16.2 36-36.1 0-11.5-3.8-18.1-7.6-23.3q-0.9-1.2-1.7-2.3c-3.1-4-5.6-7.3-5.6-12.2 0-2.8 0.4-6.8 2.3-10.1 1.9-3.2 5.2-5.8 11.4-5.8h99.3 1v-1-99.3c0-6.9-3-10.9-6.8-13.1-3.7-2.2-8.2-2.6-11.1-2.6-5.6 0-9.5 3-13.5 6.1q-1.1 0.8-2.2 1.6c-4.9 3.6-11.1 7.2-22.1 7.2-18.3 0-33.3-14.5-34-32.8 0.7-18.2 15.7-32.8 34-32.8 11 0 17.2 3.6 22.1 7.3q1.1 0.8 2.2 1.6c4 3.1 7.9 6 13.5 6 2.9 0 7.4-0.3 11.1-2.5 3.8-2.2 6.8-6.2 6.8-13.1z"
            />
          </g>
          <use id="D12" href="#img1" x={343} y={92} />
          <use id="(d = 12.0)" href="#img2" x={313} y={128} />
          <use id="D11" href="#img3" x={561} y={179} />
          <use id="D10" href="#img4" x={573} y={352} />
          <use id="(d = 10.0)" href="#img5" x={554} y={465} />
          <use id="(d = 11.0)" href="#img6" x={548} y={215} />
          <use id="D9" href="#img7" x={365} y={421} />
          <use id="(d = 9.0)" href="#img8" x={362} y={453} />
          <use id="(d = 8.0)" href="#img9" x={389} y={578} />
          <use id="(d = 7.0)" href="#img10" x={186} y={448} />
          <use id="D7" href="#img11" x={213} y={339} />
          <use id="D6" href="#img12" x={756} y={400} />
          <use id="(d = 6.0)" href="#img13" x={743} y={424} />
          <use id="(d = 5.0)" href="#img14" x={575} y={609} />
          <use id="(d = 4.0)" href="#img15" x={731} y={544} />
          <use id="(d = 3.0)" href="#img16" x={247} y={596} />
          <use id="(d = 2.0)" href="#img17" x={156} y={544} />
          <use id="(d = 1.0)" href="#img18" x={402} y={688} />
          <use id="D5" href="#img19" x={599} y={583} />
          <use id="D4" href="#img20" x={743} y={518} />
          <use id="D3" href="#img21" x={276} y={513} />
          <use id="D2" href="#img22" x={169} y={526} />
          <use id="D1" href="#img23" x={405} y={670} />
          <use id="D8" href="#img24" x={386} y={548} />
        </g>
      </g>
    </svg>
  );
};

export default MaleSVGComponent;
