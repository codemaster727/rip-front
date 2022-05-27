// import { useAppDispatch } from '../state'
// import { clearUserStates } from '../utils/clearUserStates'

// export const useAccountEventListener = () => {
//   const { account, networkId: chainId, connector } = useWeb3Context()
//   const dispatch = useAppDispatch()

//   useEffect(() => {
//     if (account && connector) {
//       const handleEvent = () => {
//         clearUserStates(dispatch, chainId)
//       }

//       connector.addListener('Web3ReactDeactivate', handleEvent)
//       connector.addListener('Web3ReactUpdate', handleEvent)

//       return () => {
//         connector.removeListener('Web3ReactDeactivate', handleEvent)
//         connector.removeListener('Web3ReactUpdate', handleEvent)
//       }
//     }
//     return undefined
//   }, [account, chainId, dispatch, connector])
// }
