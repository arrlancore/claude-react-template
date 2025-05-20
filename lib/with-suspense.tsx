import React, { Suspense, ComponentType } from "react";

const DefaultFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      padding: "20px",
    }}
  >
    <div
      style={{
        width: "30px",
        height: "30px",
        border: "3px solid #f3f3f3",
        borderTop: "3px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

interface WithSuspenseProps {
  fallback?: React.ReactNode;
}

function withSuspense<P extends object>(
  WrappedComponent: ComponentType<P>,
  fallbackElement: React.ReactNode = <DefaultFallback />
) {
  return function WithSuspenseComponent(props: P & WithSuspenseProps) {
    return (
      <Suspense fallback={props.fallback || fallbackElement}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };
}

export default withSuspense;
