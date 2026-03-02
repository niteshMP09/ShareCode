import { useHome } from '@/hooks';
import { CreateRoom, JoinRoom, TabToggle } from '@/components';
import { generateId } from '@/utils/generateId';
import { HomeMode } from '@/types/home';

export function Home() {
  const {
    mode,
    setMode,
    createName,
    setCreateName,
    roomId,
    setRoomId,
    createLoading,
    createError,
    joinName,
    setJoinName,
    joinRoomId,
    setJoinRoomId,
    joinLoading,
    joinError,
    handleCreate,
    handleJoin,
  } = useHome();

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Get started</h2>
          <p className="text-gray-500 text-sm mt-1">Create a room or join an existing one</p>
        </div>
        <TabToggle
          value={mode}
          onChange={setMode}
          className="mb-6"
          options={[
            { label: 'Create a Room', value: HomeMode.Create },
            { label: 'Join a Room', value: HomeMode.Join },
          ]}
        />
        {mode === HomeMode.Create ? (
          <CreateRoom
            name={createName}
            roomId={roomId}
            loading={createLoading}
            error={createError}
            onNameChange={setCreateName}
            onRoomIdChange={(value) => setRoomId(value.toUpperCase())}
            onGenerateId={() => setRoomId(generateId())}
            onSubmit={handleCreate}
          />
        ) : (
          <JoinRoom
            name={joinName}
            roomId={joinRoomId}
            loading={joinLoading}
            error={joinError}
            onNameChange={setJoinName}
            onRoomIdChange={(value) => setJoinRoomId(value.toUpperCase())}
            onSubmit={handleJoin}
          />
        )}
      </div>
    </div>
  );
}
