"use client"; // Error components must be Client Components

export default function Error({}: {}) {
  return (
    <div>
      <h2>You need to be logged in to check a private group</h2>
      {/* <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button> */}
    </div>
  );
}
