import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const RoomPage = () => {
    const [roomId, setRoomId] = useState("")
    const {data : authUser} = useQuery({
        queryKey: ["authUser"],
    })
    const userId = authUser?._id

    const queryClient = useQueryClient()

    const {mutate: rooms, isLoading} = useMutation({
        mutationFn: async ({ userId, roomId}) => {
            try {
                const res = await fetch("/api/rooms/joined", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId, roomId }),
                })
                const data = await res.json()
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong")
                }
                return data
            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess: () => {
            toast.success("Room joined successfully")
            queryClient.invalidateQueries({ queryKey: ["rooms"] })
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    console.log(authUser)

    const handleSubmit = (e) => {
        e.preventDefault()
        rooms({ userId, roomId })
    }

    
  return (
    <div className="w-full max-w-[500px] lg:max-w-full md:max-w-[550px] py-5 mx-auto my-5 px-4 border border-white-gray rounded-[25px] overflow-y-hidden overflow-x-hidden bg-white">
        <div className="flex justify-between items-center py-4">
          <p className="font-bold text-2xl">Rooms</p>
        </div>

        <div className="join-classroom">
      <h2>Join a Classroom</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Classroom ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Joining..." : "Join Classroom"}
        </button>
      </form>
    </div>

        <div className="w-full overflow-y-scroll overflow-x-hidden scrollbar-thin max-h-[95vh] pb-[200px]">
        </div>
      </div>
  )
}

export default RoomPage