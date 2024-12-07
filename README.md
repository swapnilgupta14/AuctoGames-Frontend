# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```
20.-CricketWebApp
├─ .git
│  ├─ COMMIT_EDITMSG
│  ├─ config
│  ├─ description
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ objects
│  │  ├─ 00
│  │  │  └─ cd2128e0d57f2ca629c3cb676c4563d991a52e
│  │  ├─ 02
│  │  │  └─ 1d7fd74a3140f2a72cb5995f95dd0f57c35a3f
│  │  ├─ 03
│  │  │  └─ 051436214ff050ded6a77fd2a1aa079d459abd
│  │  ├─ 04
│  │  │  ├─ 043a6b112df06a9ec36d9f1c5b3322bc1fde0b
│  │  │  └─ 251a6c4f844c90639845b853d159ed1688622a
│  │  ├─ 05
│  │  │  └─ 20fbd24e48423b89a014b3704af2cfbfadfbf9
│  │  ├─ 0d
│  │  │  └─ d8cdb73132c57d25620507f8a2f1768faeafa2
│  │  ├─ 12
│  │  │  └─ a7183ee53a7e4d59d1d2b5c9401c28950e9ad0
│  │  ├─ 13
│  │  │  └─ e86507da25d48e0f24159190719bf6f4055284
│  │  ├─ 14
│  │  │  └─ 46ea66283326c5bc29c2bfd96d14c96b9322fd
│  │  ├─ 15
│  │  │  └─ 8048ae8cf4954bbbf42d6f5cb58ca2a265b18a
│  │  ├─ 16
│  │  │  └─ 697b60b467564b0a782cad769cde05ca5615f1
│  │  ├─ 19
│  │  │  └─ 39cd8b6a6238606d22789201a569651acee0b5
│  │  ├─ 1a
│  │  │  ├─ 0df97fa14f74bc911c35a78185af190ee4c150
│  │  │  └─ 5872100e6d84ca3d5ed4cf3fc316545d93f701
│  │  ├─ 1d
│  │  │  └─ 8eec1bb0cb80a9982c46bdd6c24825536cc8d7
│  │  ├─ 1e
│  │  │  ├─ 522d3112c7ccd27bb1fc6824694441de11d43c
│  │  │  ├─ c497740a17736465e4971cb173aa04b8830fc7
│  │  │  └─ c73aa4847cd7dc26dcc4bcc4751980c075c192
│  │  ├─ 1f
│  │  │  └─ 1e14d43f5b38ccc71d94d384ff93cda46f31f8
│  │  ├─ 24
│  │  │  └─ 0dfad9ab417b356d4e7cd2d9bd4c9cea7600a3
│  │  ├─ 26
│  │  │  └─ 0a1d8bef4df2c111182a6759843a392d731585
│  │  ├─ 28
│  │  │  └─ 86e9b3d8064a9d35b4bd055c03a60ad6c058ce
│  │  ├─ 29
│  │  │  ├─ 3bcfceb90bf931c2d27af569858b4c3d2fff52
│  │  │  └─ 77cd1b407a2647e1436b7a72b92678e2c85119
│  │  ├─ 2b
│  │  │  └─ 368769edb36986a15b2fd510a7e85f3554be69
│  │  ├─ 30
│  │  │  └─ 680e502b749d02802fae9429ca44d4d279571e
│  │  ├─ 31
│  │  │  └─ d0da1675eea0dc55d2efba1186731453036d9f
│  │  ├─ 37
│  │  │  └─ 1e0bc34b8861f62dfc553cd790824b2a1450c8
│  │  ├─ 38
│  │  │  └─ e2327f7c668ffd8038b2ef24f75020abbcff99
│  │  ├─ 39
│  │  │  └─ 98f746a6973c1a7524f700b23e5268169280be
│  │  ├─ 40
│  │  │  └─ 639c106396c110c2cf44a0fb87939eb21d22b3
│  │  ├─ 41
│  │  │  ├─ 00c547bb847fc24ff80c733101b58f8520c6f5
│  │  │  └─ daeebaebf0450e91a0a4530e8971b0f3f7c2ff
│  │  ├─ 43
│  │  │  └─ b95231a884ebac85b077032734a5676012f126
│  │  ├─ 44
│  │  │  └─ e32cb39eea8a651d70c9dafe1cfe729681e64a
│  │  ├─ 46
│  │  │  └─ 3133f52d1eecffdb5994bd7bad05877c66f452
│  │  ├─ 4c
│  │  │  └─ d1514cf02b04f805755319d490fca545927281
│  │  ├─ 4e
│  │  │  └─ f1c9bffc6ce2c1995340c8c5cd9b04ac16bac7
│  │  ├─ 4f
│  │  │  └─ d4a7ed7e18d8cc59e1b4a42cdb12b2af6dd3f7
│  │  ├─ 50
│  │  │  └─ a95884b9d7cf2c4bd9ce81054e55f6570c69b3
│  │  ├─ 54
│  │  │  └─ ef062c8eac97a535b2f27cbfa1f226b8b15762
│  │  ├─ 56
│  │  │  └─ b7620701a1ef3582fdabfca303680b9aa5f715
│  │  ├─ 59
│  │  │  └─ a18e0b6c05aebed6b134981de509aa38ff9ff8
│  │  ├─ 5c
│  │  │  └─ e6593707602e3146f886e00963c69b96d4d6d8
│  │  ├─ 5e
│  │  │  └─ 28a5c8dc303cbd52c29cca15f21211da54fc3e
│  │  ├─ 60
│  │  │  └─ 6f915bda242ee8e5d818ca4b7cf48c23b62d16
│  │  ├─ 61
│  │  │  └─ a9aa79f638455b21f0ba12296b52bedbb2a39a
│  │  ├─ 63
│  │  │  └─ 6edd7f28b6932549738c46c6af0556b13c9f02
│  │  ├─ 64
│  │  │  └─ fc4ed34f6fd6f6f6e66f6161e0b891a9d6533f
│  │  ├─ 65
│  │  │  └─ a13cae2f8f5db75f38d46ca79b7958e40fc54b
│  │  ├─ 66
│  │  │  └─ e903d79f5918053cc8cf5763e4a161f684b42b
│  │  ├─ 67
│  │  │  └─ 5684bbc365d9c0b62be258b6ae751c9753d908
│  │  ├─ 6a
│  │  │  └─ 9daffe40bd3d678005497948ec69911a8a6adf
│  │  ├─ 6d
│  │  │  └─ 6d7441c6b40d651321764ccc42fd240a157546
│  │  ├─ 71
│  │  │  └─ e37c9a03b07ac647f0b019d6da250a51b50dc2
│  │  ├─ 73
│  │  │  └─ 086d360838edc29cfe587e687b82cc131a2529
│  │  ├─ 77
│  │  │  ├─ 725ab50ecff2bec33a798c017f1076b3692ff9
│  │  │  └─ 9dfb5dd217697a9af15d32710bbdc8f2353619
│  │  ├─ 78
│  │  │  └─ c6db2c2738d859e19d10806f6514b9eb89ec4a
│  │  ├─ 7b
│  │  │  └─ 373ab11baba4493421e13fb4c3d64bc9c321d9
│  │  ├─ 7d
│  │  │  └─ d217422417263c2988cbaf98b36a81f5e89c04
│  │  ├─ 7f
│  │  │  └─ f2b474cbb0345a42dabf0d9bc157a4b7743887
│  │  ├─ 83
│  │  │  └─ a1d0e7bf9ad47f422bcfd8878c8d824a4e619f
│  │  ├─ 84
│  │  │  └─ e1a5d00566c0172526e1d582bc0b955b7e65eb
│  │  ├─ 85
│  │  │  └─ 1fcd6dfa97f5d2027165840bb8aadbe0701ee2
│  │  ├─ 87
│  │  │  └─ 3ccad6335b3f2300c06a334eaaf5da97b59335
│  │  ├─ 88
│  │  │  └─ cab7ad42d726cbb4625b76310fd8901bba1ad0
│  │  ├─ 89
│  │  │  ├─ 3916dc75beeb08131f18e29ca76145204b68b5
│  │  │  └─ dfe7fb3b5aa5b1675a4befa2811dbe323dc582
│  │  ├─ 8b
│  │  │  └─ e93a906dfd4fca5b00bc8311c106da782c4714
│  │  ├─ 8c
│  │  │  └─ 926c5d9412b1eb6726a3448d0b9f2c33341ce0
│  │  ├─ 8d
│  │  │  ├─ 65ea4b6c08efdcfe62e4b887280c7a8798059a
│  │  │  └─ 8a20cf139d01c5a6ce4a909c79d2cf00bb40e6
│  │  ├─ 8f
│  │  │  └─ d5df6388501ca32a6311d7b7b0ebd61393baac
│  │  ├─ 90
│  │  │  ├─ 03abf413924faf7d30d6081b4fb8f9e8f93237
│  │  │  └─ 3a173ed3e6ef39623cc47146446e57d459d426
│  │  ├─ 93
│  │  │  └─ 50ca3a2713995ea4e1fdf17781f8acdbc14485
│  │  ├─ 99
│  │  │  └─ 7e1136e09bc92359487de85d858c363229e711
│  │  ├─ 9e
│  │  │  └─ fa59cbed5ef7386ed7ace4171e5ee74316dc2b
│  │  ├─ 9f
│  │  │  └─ 12b8ec89b03df5f8553c312cf28dd7b9c3c960
│  │  ├─ a3
│  │  │  └─ 02b376b67d061257108c01d2ba217bdc5d42bd
│  │  ├─ a4
│  │  │  └─ cc28ae84de9a3af19702ce9fe46365a3bf4ec0
│  │  ├─ ae
│  │  │  └─ 3d7e6775e1cf7d6629f7dcaee8301ef93a3b45
│  │  ├─ b0
│  │  │  └─ 5aa79a429be9ed13cbef935e322dcd899c347a
│  │  ├─ b2
│  │  │  └─ 3c57f67beeb2a8affa8d37af15964c270ed233
│  │  ├─ b3
│  │  │  ├─ 1553990b5ed6ceedfabb4e3f5930225aabc5a6
│  │  │  ├─ 5067b23927dbb3e7ded7d27c58397c591352a4
│  │  │  └─ 75e3b5e2f65d9a8044c021147b4add57c813a2
│  │  ├─ b5
│  │  │  └─ a4345cbcb2904ca2b7af3a9d2b4acc6605a8ea
│  │  ├─ b6
│  │  │  └─ ff6d5fa760794b8aabae4d69aa455b43746365
│  │  ├─ b7
│  │  │  └─ 68c3f49b5d92977d155122ccfd56a74065202d
│  │  ├─ ba
│  │  │  └─ 211c50d3c80782494c02e0ab25c67f01a0a3eb
│  │  ├─ be
│  │  │  └─ 9e9edd375d3fa7eaec869c596dd3e828e48d17
│  │  ├─ bf
│  │  │  └─ 76e1d892769ae61cd5cb2a71b4767e68a8933e
│  │  ├─ c2
│  │  │  └─ 9a401b55c193c43d1f5ad787d00efe14894ab8
│  │  ├─ c3
│  │  │  └─ 13e005fb2982b161ba4d40c473a883532be97b
│  │  ├─ c4
│  │  │  └─ a3cc298e870aa255083181f97af2400b6dd16f
│  │  ├─ c5
│  │  │  └─ 37f2e39a051c34d488733c494d0f8a9e10d160
│  │  ├─ cf
│  │  │  ├─ 6a8338247121735411a636681ee63860f72425
│  │  │  └─ 94277d64f932d6a5cd47eabf9ee2ec8618e58e
│  │  ├─ d0
│  │  │  └─ 303dd9719b0cd61448d3f69288f11fa1786af1
│  │  ├─ d1
│  │  │  └─ be28015f85d6bf57af7efd9f22e6ee9963c05c
│  │  ├─ d4
│  │  │  └─ 5f8d15e238e7bc3cf80a0bcc2b1e13f7320848
│  │  ├─ d5
│  │  │  ├─ b777dd4e4ab3011a9cf8a435b4a8567ba00ce5
│  │  │  └─ e68b40453797f9299f6c5f1b7d7fb5c2059558
│  │  ├─ d7
│  │  │  └─ 721d1d8a467538044864083e3de300c400b28c
│  │  ├─ da
│  │  │  └─ 3fd4980ac9e742c113519e944dacbda12951a5
│  │  ├─ dc
│  │  │  └─ fdcd1a503a1219a3e66d115d624c796dcba4e1
│  │  ├─ e6
│  │  │  └─ 0c45663ecad877fec8a421b8d3c9e17f0cbe52
│  │  ├─ ea
│  │  │  └─ 10113ae243471d6c0d63dfbc489f2cb1c84c17
│  │  ├─ ec
│  │  │  ├─ 6223bfbcbaa053fe3fa3edf3eea7ac86cdcd60
│  │  │  └─ d108787a6baab866cd5120acb9aee7f258e3b6
│  │  ├─ ef
│  │  │  └─ 113af002421211f4f3531d5aa4f5da5ed4a273
│  │  ├─ f0
│  │  │  └─ 2c0d43c5e51a63f1c50e5d26ed6b9eb88e436b
│  │  ├─ f2
│  │  │  └─ fe2d8b64f2e9f831aae3db7256199c5a47e33c
│  │  ├─ f3
│  │  │  └─ 3a3bb84c792daefe7965efa91d3a3d0a1c4a5f
│  │  ├─ f6
│  │  │  └─ f2bb301216293c134bde05d446767dde3b740a
│  │  ├─ f7
│  │  │  └─ 953ab4d66393e252665d52c3432979f92c5963
│  │  ├─ f9
│  │  │  └─ a6dab1d8177f28b01740aa67bfe5f4248aa3c9
│  │  ├─ fe
│  │  │  ├─ 702ea748d0ba03a0891203b9671c33b0d6e191
│  │  │  └─ b844036ecef034db1eca15cca4d12244439035
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-4c0e6e04ed4afa0ecf780d2abcccc6b8437983dc.idx
│  │     ├─ pack-4c0e6e04ed4afa0ecf780d2abcccc6b8437983dc.pack
│  │     └─ pack-4c0e6e04ed4afa0ecf780d2abcccc6b8437983dc.rev
│  ├─ ORIG_HEAD
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  ├─ main
│     │  └─ swapnil
│     ├─ remotes
│     │  └─ origin
│     │     ├─ HEAD
│     │     ├─ main
│     │     └─ swapnil
│     └─ tags
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ admin
│  │  ├─ AdminLayout.jsx
│  │  ├─ components
│  │  │  └─ AdminSidebar.jsx
│  │  ├─ index.jsx
│  │  └─ pages
│  │     ├─ Analytics.jsx
│  │     ├─ Auctions.jsx
│  │     ├─ HowToPay.jsx
│  │     ├─ HowToPlay.jsx
│  │     ├─ Payments.jsx
│  │     ├─ PrivacyPolicy.jsx
│  │     ├─ TermsAndConditions.jsx
│  │     └─ Users.jsx
│  ├─ api
│  │  ├─ axiosInstance.jsx
│  │  ├─ ClearBids.jsx
│  │  └─ fetch.jsx
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ bellIcon.svg
│  │  ├─ Calendar.svg
│  │  ├─ chevron-circle-right-Regular.svg
│  │  ├─ Confetti.svg
│  │  ├─ gameHistory.svg
│  │  ├─ gift.svg
│  │  ├─ hide.png
│  │  ├─ image 1.png
│  │  ├─ IPL_Auction_SIGN_UP-removebg-preview 1 (1).svg
│  │  ├─ IPL_Auction_SIGN_UP-removebg-preview 1.svg
│  │  ├─ IPL_Auction_SIGN_UP__1_-removebg-preview 1.svg
│  │  ├─ IPL_Auction_SIGN_UP__2_-removebg-preview 1.svg
│  │  ├─ leftArr.png
│  │  ├─ logout.svg
│  │  ├─ notification.svg
│  │  ├─ pl logo.svg
│  │  ├─ privacy.svg
│  │  ├─ profile.svg
│  │  ├─ react.svg
│  │  ├─ Rectangle 1.svg
│  │  ├─ rightArrWhite.svg
│  │  ├─ rules.svg
│  │  ├─ search.svg
│  │  ├─ setting.svg
│  │  ├─ show.png
│  │  ├─ t&c.svg
│  │  ├─ user (2).png
│  │  ├─ Vector (4).svg
│  │  ├─ Vector.svg
│  │  └─ whatsapp.svg
│  ├─ components
│  │  ├─ BidHistoryCard.jsx
│  │  ├─ Header.jsx
│  │  ├─ PlayerCard.jsx
│  │  ├─ TeamCard.jsx
│  │  └─ TimerComponent.jsx
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ AuctionDetail.jsx
│  │  ├─ AuctionHome.jsx
│  │  ├─ AuctionRegistration.jsx
│  │  ├─ AuctionResult
│  │  │  └─ YourTeamPlayers.jsx
│  │  ├─ AuctionRoom.jsx
│  │  ├─ BidHistory.jsx
│  │  ├─ ForgotPassPage.jsx
│  │  ├─ Home.jsx
│  │  ├─ Login.jsx
│  │  ├─ MyProfile.jsx
│  │  ├─ ResetPassword.jsx
│  │  ├─ Result.jsx
│  │  ├─ SignUp.jsx
│  │  ├─ Splash.jsx
│  │  ├─ SuccessfulRegistration.jsx
│  │  ├─ TeamsPage.jsx
│  │  ├─ TestExcel.jsx
│  │  └─ UnderConstruction.jsx
│  ├─ redux
│  │  └─ store.js
│  ├─ slices
│  │  └─ userSlice.js
│  └─ socket
│     ├─ socket.js
│     └─ socketService.js
├─ tailwind.config.js
├─ vercel.json
└─ vite.config.js

```