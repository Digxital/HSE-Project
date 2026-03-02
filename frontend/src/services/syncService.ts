// services/syncService.ts
import { microsoft365Service } from './microsoft365Service';
import { userService } from './userService';

export const syncMicrosoftUsers = async () => {
  try {
    console.log('🔄 Starting Microsoft 365 user sync...');
    
    // 1. Get all users from Microsoft 365
    const microsoftUsers = await microsoft365Service.getUsers();
    
    // 2. Get all users from your platform
    const platformUsers = await userService.getUsers();
    const platformEmails = new Set(platformUsers.map(u => u.email));
    
    // 3. Find users in Microsoft that aren't in your platform
    const newMicrosoftUsers = microsoftUsers.filter(
      mu => !platformEmails.has(mu.emailAddress || mu.userPrincipalName)
    );
    
    // 4. Create pending users using createUser with status:'pending'
    for (const mu of newMicrosoftUsers) {
      // Prepare user data for creation
      const firstName = mu.givenName || mu.displayName?.split(' ')[0] || '';
      const lastName = mu.surname || mu.displayName?.split(' ').slice(1).join(' ') || '';
      const email = mu.emailAddress || mu.userPrincipalName;
      
      // Create user with pending status
      await userService.createUser({
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: '', // No role yet - pending
        jobPosition: mu.jobTitle || '',
        createMicrosoftAccount: false, // ⭐ CRITICAL: NEVER create Microsoft account
        status: 'pending'
      }); 
      
      // Update the user's status to 'pending' (you'll need to add this to your API)
    //   await userService.updateUser(newUser.id, { status: 'pending' });
      
      // Store Microsoft ID for reference
    //   await userService.updateUser(newUser.id, { microsoftUserId: mu.id });
      
      console.log(`➕ Added pending user: ${email}`);
    }
    
    console.log(`✅ Sync complete. Added ${newMicrosoftUsers.length} new users.`);
    return newMicrosoftUsers.length;
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  }
};