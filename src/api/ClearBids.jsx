// import { useEffect, useRef } from "react";
// import { clearBids } from "./fetch";

// const ClearBids = (auctionId, activePlayer) => {
//   const previousValues = useRef({ auctionId: null, playerId: null });

//   useEffect(() => {
    

//       previousValues.current = {
//         auctionId,
//         playerId: activePlayer.id,
//       };
//     };

//     if (
//       previousValues.current.auctionId !== auctionId ||
//       previousValues.current.playerId !== activePlayer?.id
//     ) {
//       clear();
//     }
//   }, [auctionId, activePlayer?.id]);
// };

// export default ClearBids;
