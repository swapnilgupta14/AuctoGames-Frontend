const RulesModal = ({ closeRulesModal }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-11/12 max-w-md">
      <h2 className="text-xl font-bold mb-4">Team Composition Rules</h2>
      <div className="space-y-3">
        <div className="bg-gray-100 p-3 rounded-lg">
          <h3 className="font-semibold mb-2">Player Type Limits</h3>
          <ul className="list-disc list-inside">
            <li>Batsmen: 3-4 players</li>
            <li>Bowlers: 4 players</li>
            <li>Wicket Keepers: 1-2 players</li>
            <li>All Rounders: 1-2 players</li>
          </ul>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          <h3 className="font-semibold mb-2">Total Allowed Players</h3>
          <p>Maximum of 11 players total</p>
        </div>
      </div>
      <button
        onClick={() => closeRulesModal()}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
);

export default RulesModal;
