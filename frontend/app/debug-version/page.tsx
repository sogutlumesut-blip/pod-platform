export default function DebugVersionPage() {
    return (
        <div className="p-10 font-mono">
            <h1 className="text-3xl font-bold text-red-600">DEPLOYMENT DEBUGGER</h1>
            <p className="text-xl mt-4">Version: <strong>v1.2</strong></p>
            <p className="text-lg">Build Time: {new Date().toISOString()}</p>
            <p className="mt-4">If you can see this, the deployment IS working.</p>
        </div>
    );
}
